/**
 * 微信用户
 */
const mongoose = require('mongoose')

const schema = require('../schemas/weixin.mp_users')
const model = mongoose.model('weixin.mp_users', schema, 'weixin.mp_users')

module.exports = model
