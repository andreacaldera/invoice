const Browser = require('zombie')
var assert = require('chai').assert
var async = require('async')
var setup = require('./setup')
var step = require('./step')

var request = require('request')

var pdfText = require('pdf-text')
var streamToBuffer = require('stream-to-buffer')

require('mongoose').connect('mongodb://localhost/invoice')
var userService = require('../app/service/user-service')

Browser.localhost('localhost', 8080)
const browser = new Browser()

describe('A user', function () {

    this.timeout(10000);

    var email = 'some@email.com'
    var password = 'password'

    before('application start-up', setup.applicationStartUp)

    before('add user', function (done) {
        userService.add(email, password, done)
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
                browser.pressButton('#pdf-button', function () {
                    browser.assert.success

                    var j = request.jar()
                    var sessionCookie = request.cookie('connect.sid=' + browser.getCookie('connect.sid'))
                    j.setCookie(sessionCookie, 'http://localhost:8080')
                    var responseStream = request.defaults({jar: j})
                        .get(browser.url.replace('/preview/', '/pdf/'))
                        .on('response', function (response) {
                            assert.equal(response.statusCode, 200)
                            streamToBuffer(responseStream, function (error, buffer) {
                                assert.notOk(error)
                                pdfText(buffer, function (error, chunks) {
                                    assert.notOk(error)
                                    var pdfContent = chunks.join('')
                                    assert.include(pdfContent, 'Invoice')
                                    callback()
                                })
                            })

                        })
                })
            }
        ], done)
    })

})