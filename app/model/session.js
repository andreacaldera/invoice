const mongoose = require('mongoose');

module.exports = mongoose.model('invoice-session', {
  user: {
    userId: String,
    token: String,
    name: String,
    email: String,
  },
  config: {
    companyName: String,
  },
});
