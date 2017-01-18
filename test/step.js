const assert = require('assert');

function homePage(browser, callback) {
  browser.visit('/', () => {
    assert.ok(browser.success);
    callback();
  });
}

function registerPage(browser, callback) {
  browser.click('#register-link', () => {
    assert.ok(browser.success);
    browser.assert.url({ pathname: '/register' });
    callback();
  });
}

function invoicePage(browser, callback) {
  browser.click('#invoice-link', () => {
    assert.ok(browser.success);
    browser.assert.url({ pathname: '/invoice' });
    callback();
  });
}

function register(browser, email, password, callback) {
  browser.fill('email', email);
  browser.fill('password', password);
  browser.pressButton('register', () => {
    assert.ok(browser.success);
    browser.assert.url({ pathname: '/login' });
    callback();
  });
}

function login(browser, email, password, callback) {
  browser.visit('/login', () => {
    browser.fill('email', email);
    browser.fill('password', password);
    browser.click('#login-button', () => {
      assert.ok(browser.success);
      browser.assert.url({ pathname: '/' });
      callback();
    });
  });
}

module.exports = {
  login,
  homePage,
  registerPage,
  invoicePage,
  register,
};
