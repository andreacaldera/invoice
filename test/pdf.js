const Browser = require('zombie');
var assert = require('assert');
var async = require('async');
var setup = require('./setup');
var step = require('./step');

require('mongoose').connect('mongodb://localhost/invoice');
var userService = require('../app/service/user-service');

Browser.localhost('localhost', 8080);
const browser = new Browser();

describe('A user', function () {

    var email = 'some@email.com';
    var password = 'password';

    before('application start-up', setup.applicationStartUp);

    before('add user', function(done) {
        userService.add(email, password, done);
    });

    it('should able to generate an invoice PDF', function (done) {
        async.series([
                function(callback) {
                    step.login(browser, email, password, callback);
                }
            ],
            function (error) {
                if (error) throw error;
                done()
            }
        );
    });

});