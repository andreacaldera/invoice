const pdfText = require('pdf-text');
const streamToBuffer = require('stream-to-buffer');
const assert = require('chai').assert;
const request = require('request');
const fs = require('fs');

function parsePdf(buffer, callback) {
  pdfText(buffer, (error, chunks) => {
    assert.notOk(error);
    const pdfContent = chunks.join('');
    callback(pdfContent);
  });
}

function savePdf(buffer, callback) {
  const fileStream = fs.createWriteStream('output/test.pdf');
  fileStream.write(buffer);
  fileStream.end();
  callback();
}

function loadPdf(browser, callback) {
  browser.assert.success();
  const j = request.jar();
  const sessionCookie = request.cookie(`connect.sid=${browser.getCookie('connect.sid')}`);
  j.setCookie(sessionCookie, 'http://localhost:3031');
  const responseStream = request.defaults({ jar: j })
        .get(browser.url.replace('/preview/', '/pdf/'))
        .on('response', (response) => {
          assert.equal(response.statusCode, 200);

          streamToBuffer(responseStream, (error, buffer) => {
            assert.notOk(error);
            savePdf(buffer, () => {
              parsePdf(buffer, callback);
            });
          });
        });
}

module.exports = {
  loadPdf,
};
