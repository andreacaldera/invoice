var assert = require('assert');

function homePage(browser, callback) {
    browser.visit("/", function () {
        assert.ok(browser.success);
        callback();
    });
}

function registerPage(browser, callback) {
    browser.click('#register-link', function () {
        assert.ok(browser.success);
        browser.assert.url({pathname: '/register'});
        callback();
    });
}

function invoicePage(browser, callback) {
    browser.click('#invoice-link', function () {
        assert.ok(browser.success);
        browser.assert.url({pathname: '/invoice'});
        callback();
    });
}

function register(browser, email, password, callback) {
    browser.fill('email', email);
    browser.fill('password', password);
    browser.pressButton('register', function () {
        assert.ok(browser.success);
        browser.assert.url({pathname: '/login'});
        callback();
    });
}

function login(browser, email, password, callback) {
    browser.visit("/login", function () {
        browser.fill('email', email);
        browser.fill('password', password);
        browser.click('#login-button', function () {
            assert.ok(browser.success);
            browser.assert.url({pathname: '/'});
            callback();
        });
    });
}

module.exports = {
    login: login,
    homePage: homePage,
    registerPage: registerPage,
    invoicePage: invoicePage,
    register: register
}