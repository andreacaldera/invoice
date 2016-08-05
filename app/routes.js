var InvoiceConfig = require('./model/invoice-config');

var userService = require('./service/user-service');

var pdf = require('./pdf');
var _ = require('underscore');
var merge = require('merge');
var moment = require('moment');

var numeral = require('numeral');
numeral.language('en', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    currency: {
        symbol: '£'
    }
})
numeral.language('en')

function invoiceItems(req) {
    return Array.isArray(req.body.days) ?
        _.map(req.body.days, function (i) {
            return {
                description: req.body.description[i - 1],
                rate: req.body.rate[i - 1],
                days: req.body.days[i - 1]
            };
        }) :
        [{
            description: req.body.description,
            rate: req.body.rate,
            days: req.body.days
        }];
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function loadSessionData(req, next) {
    InvoiceConfig.get(req.user.email, function (error, result) {
        var config = result ? result : {fields: []}
        req.session.invoice = {
            config: config,
            preview: {}
        }
        next()
    });
}

function field(fields, name) {
    return _.find(fields, function (field) {
        return field.placeholder == name;
    });
}

function rate(fields) {
    var rateField = field(fields, 'rate')
    return {
        label: rateField != undefined ? rateField.label : 'rate',
        value: rateField != undefined ? rateField.value : '',
        placeholder: rateField != undefined ? rateField.placeholder : 'rate'
    }
}

function description(fields) {
    var descriptionField = field(fields, 'description')
    return {
        label: descriptionField != undefined ? descriptionField.label : 'description',
        value: descriptionField != undefined ? descriptionField.value : '',
        placeholder: descriptionField != undefined ? descriptionField.placeholder : 'description'
    }
}

function fields(req) {
    if (!Array.isArray(req.body.placeholder)) return [req.body];
    return _.map(req.body.placeholder, function (p, index) {
        return {
            placeholder: req.body.placeholder[index],
            label: req.body.label[index],
            value: req.body.value[index]
        }
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
            loggedIn: req.isAuthenticated(),
            siteFurnitures: true
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

    app.get('/register', function (req, res) {
        res.render('page.ejs', {
            title: 'register',
            content: 'register'
        });
    });

    app.post('/register', function (req, res) {
        userService.add(req.body.email, req.body.password, function (error) {
            if (error) return res.sendStatus(500);
            res.redirect('login');
        });
    });

    app.get('/config', isLoggedIn, function (req, res) {
        res.render('page.ejs', {
            content: 'config',
            title: 'invoice config',
            fields: req.session.invoice.config.fields,
            rate: rate(req.session.invoice.config.fields)
        });
    });

    app.post('/config', isLoggedIn, function (req, res) {
        InvoiceConfig.put({email: req.user.email, fields: fields(req)}, function () {
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
            fields: req.session.invoice.config.fields,
            rate: rate(req.session.invoice.config.fields),
            description: description(req.session.invoice.config.fields)

        });
    });

    app.get('/pdf/:invoiceId', isLoggedIn, function (req, res) {
        if (!req.session.invoice.preview[req.params.invoiceId]) return res.sendStatus(500)

        res.header('Content-disposition', 'attachment')
        res.header('Content-type', 'application/pdf')
        pdf.create(req, res)
    });

    app.post('/preview', isLoggedIn, function (req, res) {
        if (!req.session.invoice.config) return res.redirect('config')

        var config = {}
        _.each(req.session.invoice.config.fields, function (field) {
            config[field.placeholder] = req.body[field.placeholder]
        })
        config.items = invoiceItems(req)
        config.today = moment().format('DD-MMM-YYYY')
        config.invoiceNumber = req.body.invoiceNumber
        var invoiceId = Math.floor(Math.random() * 1000000)
        req.session.invoice.preview[invoiceId] = config
        res.redirect('/preview/' + invoiceId);
    });

    function formatAmounts(config) {
        var formattedAmounts = _.clone(config);
        formattedAmounts.items = _.map(formattedAmounts.items, function (item) {
            return {
                amount: numeral(item.amount).format('$0,0.00'),
                vat: numeral(item.vat).format('$0,0.00'),
                rate: numeral(item.rate).format('$0,0.00'),
                description: item.description,
                days: item.days

            }
        });
        formattedAmounts.total = numeral(formattedAmounts.total).format('$0,0.00')
        formattedAmounts.vatTotal = numeral(formattedAmounts.vatTotal).format('$0,0.00')
        formattedAmounts.invoiceTotal = numeral(formattedAmounts.invoiceTotal).format('$0,0.00')
        return formattedAmounts
    }

    app.get('/preview/:invoiceId', isLoggedIn, function (req, res) {
        var config = req.session.invoice.preview[req.params.invoiceId]
        if (!config) return res.sendStatus(500)

        _.each(config.items, function (item) {
            item['amount'] = item.rate * item.days
            item['vat'] = item.rate * item.days * 0.2
        })

        config.vatTotal = _.reduce(config.items, function (vatTotal, c) {
            return vatTotal + c.vat
        }, 0)
        config.total = _.reduce(config.items, function (total, c) {
            return total + c.amount
        }, 0)

        config.invoiceTotal = config.total + config.vatTotal

        var pageConfig = formatAmounts(config)
        pageConfig.invoiceId = req.params.invoiceId
        pageConfig.content = 'preview'
        pageConfig.title = 'invoice preview'
        pageConfig.siteFurnitures = req.query.download === undefined

        res.render('page.ejs', pageConfig)
    })

    app.get('/logout', function (req, res) {
        req.session.invoice = undefined;
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', {successRedirect: '/', failureRedirect: '/login'})
    );

    app.post('/login',
        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: false}) // todo enable flash
    );
};