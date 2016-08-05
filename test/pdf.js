var pdfText = require('pdf-text')
var streamToBuffer = require('stream-to-buffer')
var assert = require('chai').assert
var _ = require('underscore')
var request = require('request')
var fs = require('fs')

function parsePdf(buffer, callback) {
    pdfText(buffer, function (error, chunks) {
        assert.notOk(error)
        var pdfContent = chunks.join('')
        callback(pdfContent)
    })
}

function savePdf(buffer, callback) {
    var fileStream = fs.createWriteStream('output/test.pdf')
    fileStream.write(buffer)
    fileStream.end()
    callback()
}

function loadPdf(browser, callback) {
    browser.assert.success()
    var j = request.jar()
    var sessionCookie = request.cookie('connect.sid=' + browser.getCookie('connect.sid'))
    j.setCookie(sessionCookie, 'http://localhost:3031')
    var responseStream = request.defaults({jar: j})
        .get(browser.url.replace('/preview/', '/pdf/'))
        .on('response', function (response) {
            assert.equal(response.statusCode, 200)

            streamToBuffer(responseStream, function (error, buffer) {
                assert.notOk(error)
                savePdf(buffer, function () {
                    parsePdf(buffer, callback)
                })
            })


        })
}

module.exports = {
    loadPdf: loadPdf
}