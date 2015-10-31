var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

var session = require('express-session');
app.use(session({ secret: 'keyboard cat' }));

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./app/passport.js')(passport);

require('./app/routes.js')(app, passport);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/invoice');

var InvoiceConfig = require('./app/model/invoice-config');
InvoiceConfig.add('andrea.caldera@gmail.com', 'Acal Software Limited');

app.listen(port);
console.log('Listening on port ' + port);