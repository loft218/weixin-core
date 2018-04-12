/**
 * 店铺公众号
 */
const mongoose = require('mongoose')

const schema = require('../schemas/weixin.shop_mps')
const model = mongoose.model('weixin.shop_mps', schema, 'weixin.shop_mps')

module.exports = model
