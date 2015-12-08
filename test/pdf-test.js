const Browser = require('zombie')
var assert = require('chai').assert
var async = require('async')
var setup = require('./setup')
var step = require('./step')
var pdfReader = require('./pdf-reader')

var request = require('request')
var _ = require('underscore')

require('mongoose').connect('mongodb://localhost/invoice')
var userService = require('../app/service/user-service')

Browser.localhost('localhost', 8080)
const browser = new Browser()

describe('A user', function () {

    this.timeout(10000);

    var email = 'some@email.com'
    var password = 'password'
    var companyName = 'SomeCompany'

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
                browser.pressButton('#pdf-button', callback)
            },
            function (callback) {
                browser.assert.success

                var j = request.jar()
                var sessionCookie = request.cookie('connect.sid=' + browser.getCookie('connect.sid'))
                j.setCookie(sessionCookie, 'http://localhost:8080')
                var responseStream = request.defaults({jar: j})
                    .get(browser.url.replace('/preview/', '/pdf/'))
                    .on('response', function (response) {
                        assert.equal(response.statusCode, 200)
                        pdfReader.read(responseStream, function (pdfContent) {
                            assert.include(pdfContent, 'Invoice-' + companyName)
                            callback();
                        })
                    })
            }
        ], done)
    })

})