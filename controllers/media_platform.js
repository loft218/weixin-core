/**
 * 
 */
const assert = require('assert')
const MediaPlatform = require('../lib/media_platform')

module.exports = {
    getAccessToken: async (ctx) => {
        const _appId = ctx.query.app_id
        assert(_appId, 'app_id missed')

        let mp = new MediaPlatform(_appId)
        let access_token = await mp.getAccessToken()
        ctx.body = {
            access_token
        }
    },

    getUserAccessToken: async (ctx) => {
        const _appId = ctx.query.app_id
        const _code = ctx.query.code
        assert(_appId, 'app_id missed')
        assert(_code, 'code missed')

        let mp = new MediaPlatform(_appId)
        let token = await mp.getUserAccessToken(_code)
        ctx.body = token
    },

    getUserInfoByAccessToken: async (ctx) => {
        const _appId = ctx.query.app_id
        const _token = ctx.query.access_token
        const _openId = ctx.query.openid

        assert(_appId, 'app_id missed')
        assert(_token, 'access_token missed')
        assert(_openId, 'openid missed')

        let mp = new MediaPlatform(_appId)
        let user = await mp.getUserInfoByAccessToken(_token, _openId)
        ctx.body = user
    },

    getJsTicket: async (ctx) => {
        const _appId = ctx.query.app_id
        assert(_appId, 'app_id missed')

        let mp = new MediaPlatform(_appId)
        let ticket = await mp.getJsTicket()
        ctx.body = {
            ticket
        }
    },

    getJsSign: async (ctx) => {
        const _appId = ctx.query.app_id
        const _url = ctx.query.url
        assert(_appId, 'app_id missed')

        let mp = new MediaPlatform(_appId)
        let wxConfig = await mp.getJsSign(_url)
        ctx.body = wxConfig
    },
}