/**
* ids
*/
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    id: Number
})

// schema.static('newId', function (name) {
//     return this.findOneAndUpdate({ name: name }, { $inc: { id: 1 } }, { new: true, upsert: true }).exec()
// })

module.exports = schema