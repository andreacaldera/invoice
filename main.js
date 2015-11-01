var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/invoice');

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({ secret: 'session secret' }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/passport.js')(passport);
require('./app/routes.js')(app, passport);

// todo remove this
var InvoiceConfig = require('./app/model/invoice-config');
InvoiceConfig.add('andrea.caldera@gmail.com', 'Acal Software Limited', function() {} );

app.listen(port);
console.log('Listening on port ' + port);