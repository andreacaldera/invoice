const Browser = require('zombie');
var assert = require('assert');
var testSetup = require('./test-setup');

Browser.localhost('localhost', 8080);
const browser = new Browser();

describe('A non-authenticated user', function () {

    before('setup', testSetup.applicationStartUp);

    it('should be redirected to the login page', function (done) {
        browser.visit("/", function () {
            assert.ok(browser.success);
            browser.assert.url({pathname: '/login'});
            done();
        });
    });

});