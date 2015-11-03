var mongoose = require('mongoose');

var InvoiceConfig = mongoose.model('invoice-config', {
    email: String,
    fields: [
        {
            placeholder: String,
            label: String,
            value: String
            // todo add type?
        }
    ]
});

function update(config, data, callback) {
    config.update(data, callback);
}

function add(data, callback) {
    new InvoiceConfig(data).save(function (error) {
        callback(error, data);
    });
}

function put(data, callback) {
    InvoiceConfig.findOne({'email': data.email}, function (error, result) {
        if (error) callback(error);
        result ? update(result, data, callback) : add(data, callback);
    });
}

function get(email, callback) {
    InvoiceConfig.findOne({'email': email}, callback);
}

module.exports = {
    put: put,
    get: get
}