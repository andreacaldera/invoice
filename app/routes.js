const InvoiceConfig = require('./model/invoice-config');

const userService = require('./service/user-service');

const pdf = require('./pdf');
const _ = require('underscore');
const moment = require('moment');

const numeral = require('numeral');

numeral.language('en', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  currency: {
    symbol: '£',
  },
});
numeral.language('en');

function invoiceItems(req) {
  return Array.isArray(req.body.days) ?
        _.map(req.body.days, (i) => ({
          description: req.body.description[i - 1],
          rate: req.body.rate[i - 1],
          days: req.body.days[i - 1],
        })) :
  [{
    description: req.body.description,
    rate: req.body.rate,
    days: req.body.days,
  }];
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function loadSessionData(req, next) {
  InvoiceConfig.get(req.user.email, (error, result) => {
    const config = result || { fields: [] };
    req.session.invoice = {
      config,
      preview: {},
    };
    next();
  });
}

function field(fieldList, name) {
  return _.find(fieldList, (f) => f.placeholder === name);
}

function rate(fieldList) {
  const rateField = field(fieldList, 'rate');
  return {
    label: rateField !== undefined ? rateField.label : 'rate',
    value: rateField !== undefined ? rateField.value : '',
    placeholder: rateField !== undefined ? rateField.placeholder : 'rate',
  };
}

function description(fieldList) {
  const descriptionField = field(fieldList, 'description');
  return {
    label: descriptionField !== undefined ? descriptionField.label : 'description',
    value: descriptionField !== undefined ? descriptionField.value : '',
    placeholder: descriptionField !== undefined ? descriptionField.placeholder : 'description',
  };
}

function fields(req) {
  if (!Array.isArray(req.body.placeholder)) return [req.body];
  return _.map(req.body.placeholder, (p, index) => ({
    placeholder: req.body.placeholder[index],
    label: req.body.label[index],
    value: req.body.value[index],
  }));
}

module.exports = (app, passport) => {
  app.use((req, res, next) => {
    if (!req.isAuthenticated()) return next();

    if (!req.session.invoice) {
      loadSessionData(req, next);
    } else {
      next();
    }
  });

  app.use((req, res, next) => {
    res.locals = {
      loggedIn: req.isAuthenticated(),
      siteFurnitures: true,
    };
    next();
  });

  app.get('/', isLoggedIn, (req, res) => {
    res.render('page.ejs', {
      title: 'home',
      content: 'home',
    });
  });

  app.get('/login', (req, res) => {
    res.render('page.ejs', {
      title: 'login',
      content: 'login',
    });
  });

  app.get('/register', (req, res) => {
    res.render('page.ejs', {
      title: 'register',
      content: 'register',
    });
  });

  app.post('/register', (req, res) => {
    userService.add(req.body.email, req.body.password, (error) => {
      if (error) return res.sendStatus(500);
      res.redirect('login');
    });
  });

  app.get('/config', isLoggedIn, (req, res) => {
    res.render('page.ejs', {
      content: 'config',
      title: 'invoice config',
      fields: req.session.invoice.config.fields,
      rate: rate(req.session.invoice.config.fields),
    });
  });

  app.post('/config', isLoggedIn, (req, res) => {
    InvoiceConfig.put({ email: req.user.email, fields: fields(req) }, () => {
      loadSessionData(req, () => {
        res.redirect('config');
      });
    });
  });

  app.get('/invoice', isLoggedIn, (req, res) => {
    if (!req.session.invoice.config) return res.redirect('config');

    res.render('page.ejs', {
      content: 'invoice',
      title: 'create invoice',
      fields: req.session.invoice.config.fields,
      rate: rate(req.session.invoice.config.fields),
      description: description(req.session.invoice.config.fields),

    });
  });

  app.get('/pdf/:invoiceId', isLoggedIn, (req, res) => {
    if (!req.session.invoice.preview[req.params.invoiceId]) return res.sendStatus(500);

    res.header('Content-disposition', 'attachment');
    res.header('Content-type', 'application/pdf');
    pdf.create(req, res);
  });

  app.post('/preview', isLoggedIn, (req, res) => {
    if (!req.session.invoice.config) return res.redirect('config');

    const config = {};
    _.each(req.session.invoice.config.fields, (f) => {
      config[f.placeholder] = req.body[f.placeholder];
    });
    config.items = invoiceItems(req);
    config.today = moment().format('DD-MMM-YYYY');
    config.invoiceNumber = req.body.invoiceNumber;
    const invoiceId = Math.floor(Math.random() * 1000000);
    req.session.invoice.preview[invoiceId] = config;
    res.redirect(`/preview/${invoiceId}`);
  });

  function formatAmounts(config) {
    const formattedAmounts = _.clone(config);
    formattedAmounts.items = _.map(formattedAmounts.items, (item) => ({
      amount: numeral(item.amount).format('$0,0.00'),
      vat: numeral(item.vat).format('$0,0.00'),
      rate: numeral(item.rate).format('$0,0.00'),
      description: item.description,
      days: item.days,

    }));
    formattedAmounts.total = numeral(formattedAmounts.total).format('$0,0.00');
    formattedAmounts.vatTotal = numeral(formattedAmounts.vatTotal).format('$0,0.00');
    formattedAmounts.invoiceTotal = numeral(formattedAmounts.invoiceTotal).format('$0,0.00');
    return formattedAmounts;
  }

  app.get('/preview/:invoiceId', isLoggedIn, (req, res) => {
    const config = req.session.invoice.preview[req.params.invoiceId];
    if (!config) return res.sendStatus(500);

    _.each(config.items, (item) => {
      item.amount = item.rate * item.days;
      item.vat = item.rate * item.days * 0.2;
    });

    config.vatTotal = _.reduce(config.items, (vatTotal, c) => vatTotal + c.vat, 0);
    config.total = _.reduce(config.items, (total, c) => total + c.amount, 0);

    config.invoiceTotal = config.total + config.vatTotal;

    const pageConfig = formatAmounts(config);
    pageConfig.invoiceId = req.params.invoiceId;
    pageConfig.content = 'preview';
    pageConfig.title = 'invoice preview';
    pageConfig.siteFurnitures = req.query.download === undefined;

    res.render('page.ejs', pageConfig);
  });

  app.get('/logout', (req, res) => {
    req.session.invoice = undefined;
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
  );

  app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: false }) // todo enable flash
  );
};
