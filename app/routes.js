var InvoiceConfig = require('./model/invoice-config');
var invoicePdf = require('./invoice-pdf');
var _ = require('underscore');

function invoiceItems(req) {
    return Array.isArray(req.body.days) ?
        _.map(req.body.days, function (i) {
            return {
                description: req.body.description[i - 1],
                dailyRate: req.body.rate[i - 1],
                numberOfDays: req.body.days[i - 1]
            };
        }) :
        [{
            description: req.body.description,
            dailyRate: req.body.rate,
            numberOfDays: req.body.days
        }];
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function loadSessionData(req, next) {
    InvoiceConfig.load(req.user.email, function (error, result) {
        var config = !error ? result : {};
        req.session.invoice = {
            config: config
        };
        next();
    });
}

module.exports = function (app, passport) {

    app.use(function (req, res, next) {
        if (!req.isAuthenticated()) return next();

        if (!req.session.invoice) {
            loadSessionData(req, next);
        } else {
            next();
        }
    });

    app.use(function (req, res, next) {
        res.locals = {
            loggedIn: req.isAuthenticated()
        };
        next();
    });

    app.get('/', isLoggedIn, function (req, res) {
        res.render('page.ejs', {
            title: 'home',
            content: 'home'
        });
    });

    app.get('/login', function (req, res) {
        res.render('page.ejs', {
            title: 'login',
            content: 'login'
        });
    });

    app.get('/config', isLoggedIn, function (req, res) {
        res.render('page.ejs', {
            content: 'config',
            title: 'invoice config',
            companyName: req.session.invoice.config ? req.session.invoice.config.companyName : undefined
        });
    });

    app.post('/config', isLoggedIn, function (req, res) {
        if (!req.body.companyName) return res.send(400);
        InvoiceConfig.add(req.user.email, req.body.companyName, function () {
            loadSessionData(req, function () {
                res.redirect('config');
            });
        });
    });

    app.get('/invoice', isLoggedIn, function (req, res) {
        if (!req.session.invoice.config) return res.redirect('config');
        res.render('page.ejs', {
            content: 'invoice',
            title: 'create invoice',
            companyName: req.session.invoice.config.companyName
        });
    });

    app.post('/invoice', isLoggedIn, function (req, res) {
        if (!req.session.invoice.config) return res.redirect('config');

        invoicePdf.create({companyName: req.body.companyName}, invoiceItems(req), function (error, data) {
            if (error) return res.send(500);
            res.contentType("application/pdf");
            res.send(data);
        });
    });

    app.get('/logout', function (req, res) {
        req.session.invoice = undefined;
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

};