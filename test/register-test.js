const Browser = require('zombie');
const assert = require('assert');
const async = require('async');
const setup = require('./setup');
const step = require('./step');

Browser.localhost('localhost', 3031);
const browser = new Browser();

describe('A user with no login access', () => {
  before('setup', setup.applicationStartUp);

  it('should be able to register and login', (done) => {
    const email = 'new-user@email.com';
    const password = 'Password123';
    async.series(
      [
        (callback) => step.homePage(browser, callback),
        (callback) => step.homePage(browser, callback),
        (callback) => step.registerPage(browser, callback),
        (callback) => step.register(browser, email, password, callback),
        (callback) => step.login(browser, email, password, callback),
      ],
      (error) => {
        if (error) assert.equal(false, error);
        done();
      }
        );
  });
});
