/**
* mp tokens
*/

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //公众号app_id
    app_id: { type: String, required: true, unique: true },
    access_token: { type: String, required: true },
    //过期时间（uts）
    //当前时间+有效期
    token_expired: { type: Number, required: true },

    js_ticket: String,
    ticket_expired: Number,
    updated: Number
})

module.exports = schema