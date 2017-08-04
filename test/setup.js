const request = require('request');

const { port } = require('../app/config/server');

module.exports = {
  applicationStartUp(done) {
    const wait = setInterval(() => {
      request(`http://localhost:${port}/login`, (error, response) => {
        if (error) {
          console.error(error); //eslint-disable-line
        }
        if (!error && response.statusCode === 200) {
          clearInterval(wait);
          done();
        }
      });
    }, 100);
  },
};
