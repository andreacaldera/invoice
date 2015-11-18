const Browser = require('zombie');
var assert = require('assert');
var async = require('async');
var testSetup = require('./test-setup');

Browser.localhost('localhost', 8080);
const browser = new Browser();

describe('A user with no login access', function () {

    before('setup', testSetup.applicationStartUp);

    function homePage(callback) {
        browser.visit("/", function () {
            assert.ok(browser.success);
            callback();
        });
    }

    function registerPage(callback) {
        browser.click('#register-link', function () {
            assert.ok(browser.success);
            browser.assert.url({pathname: '/register'});
            callback();
        });
    }

    function register(email, password, callback) {
        browser.fill('email', email);
        browser.fill('password', password);
        browser.pressButton('register', function () {
            assert.ok(browser.success);
            browser.assert.url({pathname: '/login'});
            callback();
        });
    }

    function login(email, password, callback) {
        browser.fill('email', email);
        browser.fill('password', password);
        browser.click('#login-button', function () {
            assert.ok(browser.success);
            browser.assert.url({pathname: '/'});
            callback();
        });
    }

    it('should be able to register and login', function (done) {
        var email = 'new-user@email.com';
        var password = 'Password123';
        async.series([
                homePage,
                registerPage,
                function (callback) {
                    register(email, password, callback)
                },
                function(callback) {
                    login(email, password, callback);
                }
            ],
            function (error) {
                if (error) throw error;
                done()
            }
        );
    });

});