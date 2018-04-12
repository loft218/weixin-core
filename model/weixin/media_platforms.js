/**
 * 
 */
const mongoose = require('mongoose')

const schema = require('../schemas/weixin.media_platforms')
const model = mongoose.model('weixin.media_platforms', schema, 'weixin.media_platforms')

module.exports = model
