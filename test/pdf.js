var pdfText = require('pdf-text')
var streamToBuffer = require('stream-to-buffer')
var assert = require('chai').assert
var _ = require('underscore')
var request = require('request')

function parsePdf(stream, callback) {
    streamToBuffer(stream, function (error, buffer) {
        assert.notOk(error)
        pdfText(buffer, function (error, chunks) {
            assert.notOk(error)
            var pdfContent = chunks.join('')
            callback(pdfContent)
        })
    })
}

function loadPdf(browser, callback) {
    browser.assert.success()
    var j = request.jar()
    var sessionCookie = request.cookie('connect.sid=' + browser.getCookie('connect.sid'))
    j.setCookie(sessionCookie, 'http://localhost:8080')
    var responseStream = request.defaults({jar: j})
        .get(browser.url.replace('/preview/', '/pdf/'))
        .on('response', function (response) {
            assert.equal(response.statusCode, 200)
            parsePdf(responseStream, callback)
        })
}

module.exports = {
    loadPdf: loadPdf
}