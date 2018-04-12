/**
 * ids
 */
const mongoose = require('mongoose')

const schema = require('./schemas/ids')
const model = mongoose.model('ids', schema, 'ids')

module.exports = model
