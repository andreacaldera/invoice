var request = require('request');

module.exports = {
    applicationStartUp: function (done) {
        var wait = setInterval(function () {
            request('http://localhost:3031/login', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    clearInterval(wait);
                    done();
                }
            })
        }, 100);
    }
}