/**
 * mp
 */
const assert = require('assert')
const crypto = require('crypto')
const rp = require('request-promise')
const log4js = require('log4js')
const logger = log4js.getLogger('lib.mp')

const model = require('../model')
const WeiXinUser = require('./wx_user')

class MediaPlatform {
    constructor(appId) {
        logger.info(`constructor appid:${appId}`)
        this.app_id = appId
    }

    /**
     * 获取公众号access_token
     * @return String
     */
    async getAccessToken() {
        let mp = await MediaPlatform.getByAppId(this.app_id)
        assert(mp, 'not found mp')

        let mpToken = await model.weixin.mp_tokens.findOne({ app_id: mp.app_id })
        //默认有效期为7200，保留3600s
        if (mpToken && mpToken.token_expired > parseInt(Date.now() / 1000) + 3600)
            return mpToken.access_token

        logger.info('fetch access_token')
        let resp = await rp.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${mp.app_id}&secret=${mp.app_secret}`, { json: true })
        logger.debug(resp)
        /* 
        errcode
        doc:https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183 
        */
        if (resp.errcode) {
            logger.error(resp)
            return Promise.reject(`[${resp.errcode}]${resp.errmsg}`)
        }

        const accessToken = resp.access_token
        const expired = parseInt(Date.now() / 1000) + resp.expires_in

        model.weixin.mp_tokens.update({ app_id: mp.app_id }, {
            access_token: accessToken,
            token_expired: expired,
            updated: parseInt(Date.now() / 1000)
        }, { upsert: true }, (err) => {
            if (err) logger.error(err)
        })

        return accessToken
    }

    /**
     * 获取用户access_token
     * @param {String} code 
     */
    async getUserAccessToken(code) {
        assert(code, 'code required')

        let mp = await MediaPlatform.getByAppId(this.app_id)
        assert(mp, 'not found mp')

        logger.info('fetch user access_token')
        var rqOpts = {
            method: 'GET',
            uri: 'https://api.weixin.qq.com/sns/oauth2/access_token',
            qs: {
                appid: mp.app_id,
                secret: mp.app_secret,
                code: code,
                grant_type: 'authorization_code'
            },
            json: true
        }
        const resp = await rp(rqOpts)
        logger.debug(resp)

        if (resp.errcode) {
            logger.error(resp)
            return Promise.reject(`[${resp.errcode}]${resp.errmsg}`)
        }
        return resp
    }

    /**
     * 通过access_token获取用户信息
     * @param {String} accessToken 
     * @param {String} openId 
     */
    async getUserInfoByAccessToken(accessToken, openId) {
        assert(accessToken, 'accessToken required')
        assert(openId, 'openId required')

        logger.info('fetch userinfo by access_token')
        const _url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
        const resp = await rp.get(_url, { json: true })
        logger.debug(resp)

        if (resp.errcode) {
            logger.error(resp)
            return Promise.reject(`[${resp.errcode}]${resp.errmsg}`)
        }

        //save wx user
        let wxUser = new WeiXinUser()
        const user = await wxUser.save({
            openid: resp.openid,
            profile: resp,
            app_id: this.appId
        })
        return user
    }

    /**
     * 获取公众号js_ticket
     * @return String
     */
    async getJsTicket() {
        let mp = await MediaPlatform.getByAppId(this.app_id)
        assert(mp, 'not found mp')

        let mpToken = await model.weixin.mp_tokens.findOne({ app_id: mp.app_id })
        //默认有效期为7200，保留3600s
        if (mpToken && mpToken.ticket_expired > parseInt(Date.now() / 1000) + 3600)
            return mpToken.js_ticket

        const baseToken = await this.getAccessToken()
        logger.info('fetch js_ticket')
        let resp = await rp.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${baseToken}&type=jsapi`, { json: true })
        logger.debug(resp)

        if (resp.errcode) {
            logger.error(resp)
            return Promise.reject(`[${resp.errcode}]${resp.errmsg}`)
        }

        const jsTicket = resp.ticket
        const expired = parseInt(Date.now() / 1000) + resp.expires_in

        model.weixin.mp_tokens.update({ app_id: mp.app_id }, {
            js_ticket: jsTicket,
            ticket_expired: expired,
            updated: parseInt(Date.now() / 1000)
        }, { upsert: true }, (err) => {
            if (err) logger.error(err)
        })

        return jsTicket
    }

    /**
    * js-sdk签名
    * @param {String} url 
    */
    async getJsSign(url) {
        assert(url, 'url required')
        url = decodeURIComponent(url)
        const jsTicket = await this.getJsTicket()
        const wxConfig = {}
        wxConfig.app_id = this.app_id;
        wxConfig.timestamp = parseInt(Date.now() / 1000)
        wxConfig.nonceStr = Math.random().toString(36).substr(2, 16)
        const temp = 'jsapi_ticket=' + jsTicket + '&noncestr=' + wxConfig.nonceStr + '&timestamp=' + wxConfig.timestamp + '&url=' + url
        wxConfig.signature = crypto.createHash('sha1')
            .update(temp, 'utf8')
            .digest('hex')
        return wxConfig
    }

    /**
     * 保存公众号平台
     * @param {Object} mediaPlatform 
     */
    async save(mediaPlatform) {
        mediaPlatform = mediaPlatform || {}
        let _mp = await MediaPlatform.getByAppId(this.app_id)
        if (!_mp)
            _mp = new model.weixin.media_platforms()
        Object.assign(_mp, mediaPlatform)
        return _mp.save()
    }

    /**
     * 根据appId获取公众号
     * @param {String} appId 
     */
    static async getByAppId(appId) {
        assert(appId, 'appId required')
        return model.weixin.media_platforms.findOne({ app_id: appId })
    }

    /**
     * 查找公众号
     * @param {Object} conditions 
     * @param {Object} projection 
     * @param {Object} options 
     */
    static async find(conditions, projection, options) {
        conditions = conditions || {}
        projections = projection || {}
        options = options || {}
        return model.weixin.media_platforms.find(conditions, projection, options)
    }
}

module.exports = MediaPlatform