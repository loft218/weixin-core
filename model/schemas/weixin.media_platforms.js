/**
* mongoose schema
*/

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //公众号app_id
    app_id: { type: String, required: true, unique: true },
    //公众号名字
    name: { type: String, required: true },
    //公众号开发secret
    app_secret: { type: String },
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