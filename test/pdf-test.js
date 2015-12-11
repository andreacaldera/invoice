const Browser = require('zombie')
var assert = require('chai').assert
var async = require('async')
var setup = require('./setup')
var step = require('./step')
var pdf = require('./pdf')

var request = require('request')
var _ = require('underscore')

require('mongoose').connect('mongodb://localhost/invoice')
var userService = require('../app/service/user-service')

Browser.localhost('localhost', 8080)
const browser = new Browser()

describe('A user', function () {

    var email = 'some@email.com'
    var password = 'password'
    var companyName = 'Some Company Ltd' // TODO currently pdf reader in test does not support spaces

    before('application start-up', setup.applicationStartUp)

    before('add user', function (done) {
        async.series([
            function (callback) {
                userService.add(email, password, callback)
            },
            function (callback) {
                var InvoiceConfig = require('../app/model/invoice-config');
                InvoiceConfig.put({
                    email: email,
                    fields: [
                        {placeholder: 'companyName', label: 'company name', value: companyName},
                        {placeholder: 'rate', label: 'rate', value: '20'}
                    ]
                }, callback)
            }
        ], done)
    })

    it('should able to generate an invoice PDF', function (done) {
        async.series([
            function (callback) {
                step.login(browser, email, password, callback)
            },
            function (callback) {
                step.invoicePage(browser, callback)
            },
            function (callback) {
                browser.fill('description', 'description 1');
                browser.fill('days', 2);
                browser.fill('rate', 10);
                callback();
            },
            function (callback) {
                browser.pressButton('#pdf-button', callback)
            },
            function (callback) {
                browser.assert.success()
                browser.assert.text('[class="invoice-row"] [class=description]', 'description 1')
                browser.assert.text('[class="invoice-row"] [class=days]', 2)
                browser.assert.text('[class="invoice-row"] [class=rate]', 10)
                browser.assert.text('[class="invoice-row"] [class=total]', 20)
                callback();
            },
            function (callback) {
                pdf.loadPdf(browser, function(pdfContent) {
                    var spaces = new RegExp(' ', 'g')
                    assert.include(pdfContent.replace(spaces, ''), 'Invoice-' + companyName.replace(spaces, ''))
                    callback();
                })
            }
        ], done)
    })

})