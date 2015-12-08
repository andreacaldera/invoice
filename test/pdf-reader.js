var pdfText = require('pdf-text')
var streamToBuffer = require('stream-to-buffer')
var assert = require('chai').assert
var _ = require('underscore')

function read(stream, callback) {
    streamToBuffer(stream, function (error, buffer) {
        assert.notOk(error)
        pdfText(buffer, function (error, chunks) {
            chunks = _.map(chunks, function (chunk) {
                return chunk.length == 1 ? chunk : chunk.substring(1, 2)
            })
            assert.notOk(error)
            var pdfContent = chunks.join('')
            callback(pdfContent)
        })
    })
}

module.exports = {
    read: read
}