const Browser = require('zombie');
const assert = require('assert');
const testSetup = require('./setup');

Browser.localhost('localhost', 3031);
const browser = new Browser();

describe('A non-authenticated user', () => {
  before('setup', testSetup.applicationStartUp);

  it('should be redirected to the login page', (done) => {
    browser.visit('/', () => {
      assert.ok(browser.success);
      browser.assert.url({ pathname: '/login' });
      done();
    });
  });
});
