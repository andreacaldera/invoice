const request = require('request');

module.exports = {
  applicationStartUp(done) {
    const wait = setInterval(() => {
      request('http://localhost:3031/login', (error, response) => {
        if (!error && response.statusCode === 200) {
          clearInterval(wait);
          done();
        }
      });
    }, 100);
  },
};
