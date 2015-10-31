var mongoose = require('mongoose');

var InvoiceConfig = mongoose.model('invoice-config', {
    email: String,
    companyName: String
});

function add(email, companyName) {
    var invoiceConfig = new InvoiceConfig({email: email, companyName: companyName});
    invoiceConfig.save(function (err) {
        if (err) throw err;
    });
}

function load(email, callback) {
    InvoiceConfig.findOne({'email': email}, 'email companyName', function (error, invoiceConfig) {
        if (error) throw err;
        callback(error, invoiceConfig);
    })
}

module.exports = {
    add: add,
    load: load
}