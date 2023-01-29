const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email_hash: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);