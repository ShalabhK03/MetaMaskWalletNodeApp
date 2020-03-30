let mongoose = require('mongoose')

let accountSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  name: String,
  mobileNumber: String,
  isActive: Boolean
})

module.exports = mongoose.model('Account', accountSchema)