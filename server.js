var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var log = require('./app/log');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var pid = require('./app/pid');

pid.start();

app.set('view engine', 'ejs');

var connectWithRetry = function () {
    return mongoose.connect('mongodb://localhost/invoice', function (error) {
        if (error) {
            log.warn('Failed to connect to mongoDB - retrying in 5 seconds', error);
            setTimeout(connectWithRetry, 5000);
        }
    });
};
connectWithRetry();

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({secret: 'session secret', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

require('./app/passport.js')(passport);
require('./app/routes.js')(app, passport);

app.listen(port);
log.info('Listening on port ' + port);

function shutdown() {
    log.info('Shutting down server');
    pid.stop();
    process.exit();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);