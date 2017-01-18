const mongoose = require('mongoose');

const InvoiceConfig = mongoose.model('invoice-config', {
  email: String,
  fields: [
    {
      placeholder: String,
      label: String,
      value: String,
            // todo add type?
    },
  ],
});

function update(config, data, callback) {
  config.update(data, callback);
}

function add(data, callback) {
  new InvoiceConfig(data).save((error) => {
    callback(error, data);
  });
}

function put(data, callback) {
  InvoiceConfig.findOne({ email: data.email }, (error, result) => {
    if (error) callback(error);
    if (result) {
      update(result, data, callback);
    } else {
      add(data, callback);
    }
  });
}

function get(email, callback) {
  InvoiceConfig.findOne({ email }, callback);
}

module.exports = {
  put,
  get,
};
