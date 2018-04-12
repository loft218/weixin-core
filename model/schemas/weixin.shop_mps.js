/**
 * 店铺公众号
 */

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //公众号app_id
    shop_id: { type: String, required: true },
    //公众号app_id
    app_id: { type: String, required: true },
})

schema.index({ shop_id: 1, app_id: 1 }, { unique: true })

module.exports = schema