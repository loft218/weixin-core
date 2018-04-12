/**
 * weixin users
 */
const assert = require('assert')

const model = require('../model')

class WeiXinUser {
    constructor() {
    }

    async save(wxUser) {
        assert(wxUser, 'wxUser required')
        assert(wxUser.openid, 'wxUser.openid required')

        let _wxUser = await model.weixin.mp_users.findOne({ openid: wxUser.openid })
        if (_wxUser) {
            if (wxUser.profile)
                _wxUser.profile = wxUser.profile
        } else {
            wxUser.wx_uid = await newWxUserId()
            _wxUser = new model.weixin.mp_users(wxUser)
        }
        return _wxUser.save()
    }

    /**
     * 根据wx_uid获取用户
     * @param {String} uid 
     */
    static async getUser(uid) {
        assert(uid, 'uid required')
        let wxUser = await model.weixin.mp_users.findOne({ wx_uid: uid })
        if (!wxUser) return Promise.reject('not found user')
        return wxUser
    }
}

let newWxUserId = async () => {
    let newWxUser = await model.ids
        .findOneAndUpdate({ name: 'wx_user' }, { $inc: { id: 1 } }, { new: true, upsert: true })
    const seed = 10000
    let wxUserId = 'wx' + (seed + newWxUser.id)
    return wxUserId
}

module.exports = WeiXinUser