/**
* mp users
*/

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //微信用户ID
    wx_uid: { type: String, required: true, unique: true },
    openid: { type: String, required: true, unique: true },
    //用户资料
    profile: {},
    //公众号app_id
    app_id: String,

    //user
    uid: Number,

    created: Number,
    updated: Number
})

schema.pre('save', function (next) {
    let self = this
    const utsNow = parseInt(Date.now() / 1000)
    if (self.isNew) {
        self.created = self.updated = utsNow
    } else {
        self.updated = utsNow
    }
    next()
})

module.exports = schema