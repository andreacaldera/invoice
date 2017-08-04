require('../server');

const Browser = require('zombie');

Browser.localhost('invoice', process.env.PORT);

const browser = new Browser();

describe('A non-authenticated user', () => {
  it('gets redirected to the login page in unauthenticated', (done) =>
    browser.visit('/123456', () => {
      console.log(browser.html());
      browser.assert.success();
      browser.assert.status(200);
      browser.assert.url({ pathname: '/login' });
      done();
    })
  );
});
