var InvoiceConfig = require('./model/invoice-config');
var invoicePdf = require('./invoice-pdf');

module.exports = function (app, passport) {

    //app.use(function (req, res, next) {
    //    req.session.test = 'test';
    //    if (!req.isAuthenticated()) return next();
    //    if (!req.session.invoice) {
    //        console.log('session invoice', req.session.invoice);
    //        InvoiceConfig.load(req.user.email, function (error, result) {
    //            if (error) return res.redirect('error');
    //            req.session.invoice = {
    //                config: result
    //            };
    //            console.log('session invoice 3', req.session.invoice);
    //            next();
    //        });
    //    }
    //    console.log('session invoice 2', req.session.invoice);
    //    next();
    //});

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

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/login', function (req, res) {
        res.render('page.ejs', {
            title: 'login',
            content: 'login'
        });
    });

    app.get('/config', isLoggedIn, function (req, res) {
        InvoiceConfig.load(req.user.email, function (error, result) {
            res.render('page.ejs', {
                content: 'config',
                title: 'invoice config',
                companyName: result ? result.companyName : undefined
            });
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