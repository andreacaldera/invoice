const Browser = require('zombie');
var assert = require('assert');
var async = require('async');
var setup = require('./setup');
var step = require('./step');

Browser.localhost('localhost', 8080);
const browser = new Browser();

describe('A user with no login access', function () {

    before('setup', setup.applicationStartUp);

    it('should be able to register and login', function (done) {
        var email = 'new-user@email.com';
        var password = 'Password123';
        async.series([
                function (callback) {
                    step.homePage(browser, callback);
                },
                function (callback) {
                    step.homePage(browser, callback);
                },
                function (callback) {
                    step.registerPage(browser, callback);
                },
                function (callback) {
                    step.register(browser, email, password, callback)
                },
                function (callback) {
                    step.login(browser, email, password, callback);
                }
            ],
            function (error) {
                if (error) assert.equal(false, error);
                done()
            }
        );
    });

});