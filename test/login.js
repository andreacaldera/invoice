const Browser = require('zombie');
var assert = require('assert');
var request = require('request');

Browser.localhost('localhost', 8080);

describe('login page', function () {

    before('setup', function(done) {
        var wait = setInterval(function() {
            request('http://localhost:8080/login', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    clearInterval(wait);
                    done();
                }
            })
        }, 100);
    });

    const browser = new Browser();

    it('should load', function (done) {
        browser.visit("/login", function () {
            assert.ok(browser.success);
            done();
        });
    });

});