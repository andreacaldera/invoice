const User = require('mongoose').model('user', {
  userId: String,
  token: String,
  name: String,
  email: String,
  password: String,
});

// function update(user, data, callback) {
//   user.update(data, callback);
// }

function add(data, callback) {
  const newUser = new User(data);
  newUser.save((error) => {
    callback(error, newUser);
  });
}

function get(id, callback) {
  User.findById(id, (error, user) => {
    callback(error, user);
  });
}

function findOne(search, callback) {
  User.findOne(search, callback);
}

// function put(email, callback) {
//   find({ email }, (error, result) => {
//     if (error) callback(error);
//     result ? update(result, data, callback) : add(data, callback);
//   });
// }

module.exports = {
  add,
  get,
  findOne,
};
