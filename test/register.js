const Browser = require('zombie');
var assert = require('assert');
var testSetup = require('./test-setup');

Browser.localhost('localhost', 8080);
const browser = new Browser();

describe('A user with no login access', function () {

    before('setup', testSetup.applicationStartUp);

    it('should be able to register and login', function (done) {
        browser.visit("/", function () {
            assert.ok(browser.success);
            browser.click('#register-link', function () {
                assert.ok(browser.success);
                browser.assert.url({pathname: '/register'});
                var email = 'new-user@email.com';
                var password = 'Password123';
                browser.fill('email', email);
                browser.fill('password', password);
                browser.pressButton('register', function() {
                    assert.ok(browser.success);
                    browser.assert.url({pathname: '/login'});
                    browser.fill('email', email);
                    browser.fill('password', password);
                    browser.click('#login-button', function() {
                        assert.ok(browser.success);
                        browser.assert.url({pathname: '/'});
                        done();
                    });
                });

            });
        });
    });

});