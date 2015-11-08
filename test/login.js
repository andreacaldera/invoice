const Browser = require('zombie');
var assert = require('assert');
Browser.localhost('localhost', 8080);

describe('login page', function () {

    const browser = new Browser();

    it('should load', function (done) {
        browser.visit("/login", function () {
            assert.ok(browser.success);
            done();
        });
    });

});