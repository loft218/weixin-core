/**
 * 
 */
const mongoose = require('mongoose')

const schema = require('../schemas/weixin.mp_tokens')
const model = mongoose.model('weixin.mp_tokens', schema, 'weixin.mp_tokens')

module.exports = model
