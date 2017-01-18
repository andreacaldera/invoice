const User = require('../model/user');

function add(email, password, callback) {
  User.add({ email, password }, callback);
}

exports = module.exports = {
  add,
};
