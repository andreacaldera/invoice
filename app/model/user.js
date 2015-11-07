var User = require('mongoose').model('user', {
    userId: String,
    token: String,
    name: String,
    email: String,
    password: String
});

function update(user, data, callback) {
    user.update(data, callback);
}

function add(data, callback) {
    var newUser = new User(data);
    newUser.save(function (error) {
        callback(error, newUser);
    });
}

function get(id, callback) {
    User.findById(id, function (error, user) {
        callback(error, user);
    });
}

function findOne(search, callback) {
    User.findOne(search, callback);
}

function put(email, callback) {
    find({'email': email}, function (error, result) {
        if (error) callback(error);
        result ? update(result, data, callback) : add(data, callback);
    });
}

module.exports = {
    add: add,
    put: put,
    get: get,
    findOne: findOne
}