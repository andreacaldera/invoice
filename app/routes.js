var InvoiceConfig = require('./model/invoice-config');
var invoicePdf = require('./invoice-pdf');

module.exports = function (app, passport) {

    app.use(function (req, res, next) {
        if (!req.isAuthenticated()) return next();

        if (!req.session.invoice) {
            InvoiceConfig.load(req.user.email, function (error, result) {
                var config = !error ? result : {};
                req.session.invoice = {
                    config: config
                };
                next();
            });
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

    app.get('/invoice', isLoggedIn, function (req, res) {
        InvoiceConfig.load(req.user.email, function (error, result) {
            error ?
                res.redirect('config') :
                res.render('page.ejs', {
                    content: 'invoice',
                    title: 'create invoice',
                    companyName: result.companyName
                });
        });
    });

    app.post('/invoice', isLoggedIn, function (req, res) {
        var invoiceItems = [
            {
                description: req.body.description,
                dailyRate: req.body.dailyRate,
                numberOfDays: req.body.numberOfDays
            }
        ];

        InvoiceConfig.load('andrea.caldera@gmail.com', function (error, invoiceConfig) {
            invoicePdf.create({companyName: req.body.companyName}, invoiceItems, function (error, data) {
                if (error) return res.send(500);
                res.contentType("application/pdf");
                res.send(data);
            });
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}