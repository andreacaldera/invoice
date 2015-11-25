var User = require('../model/user');

function add(email, password, callback) {
    User.add({email: email, password: password}, callback);
}

exports = module.exports = {
    add: add
};