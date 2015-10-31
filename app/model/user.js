var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
    userId: String,
    token: String,
    name: String,
    email: String
});