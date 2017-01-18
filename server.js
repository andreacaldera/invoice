const serverConfig = require('./app/config/server');
const log = require('./app/log');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const pid = require('./app/pid');
const mongoConfig = require('./app/config/mongo');

const express = require('express');

const app = express();

pid.start();

app.set('view engine', 'ejs');

const connectWithRetry = () =>
  mongoose.connect(mongoConfig.url, (error) => {
    if (error) {
      log.warn('Failed to connect to mongoDB - retrying in 5 seconds', error);
      setTimeout(connectWithRetry, 5000);
    }
  });
connectWithRetry();

app.use(express.static(`${__dirname}/public`));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({ secret: 'session secret', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

require('./app/passport.js')(passport);
require('./app/routes.js')(app, passport);

app.listen(serverConfig.port);
log.info(`Listening on port ${serverConfig.port}`);

function shutdown() {
  log.info('Shutting down server');
  pid.stop();
  process.exit();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
