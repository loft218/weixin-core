/**
 * weixin user
 */

const assert = require('assert')
const WeiXinUser = require('../lib/wx_user')

module.exports = {
    getUser: async (ctx) => {
        const _uid = ctx.query.wx_uid
        assert(_uid, 'wx_uid missed')

        let user = await WeiXinUser.getUser(_uid)
        ctx.body = user
    }
}