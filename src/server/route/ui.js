import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import qs from 'qs';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import fs from 'fs';
import _ from 'lodash';
import UrlPattern from 'url-pattern';

import configureStore from '../../common/store/configure-store';
import routes from '../../common/routes';
import { NAMESPACE } from '../../common/modules/constants';

import companyData from '../../../private-data/company-data.json';
import invoiceData from '../../../private-data/invoice-data.json';

const invoiceStyle = fs.readFileSync('./style/download-invoice-style.css', 'utf8');

const uiUrlPattern = new UrlPattern('/:page/:activeInvoiceId*');

export default (port, invoiceStore) => {
  const router = express.Router();

  function renderFullPage(content, store, downloadInvoice) {
    const externalJs = downloadInvoice ?
      '' :
      `<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
      `;
    const cssLibraries = downloadInvoice ?
      '' :
      `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="http://localhost:3001/dist/invoice.css" />
      `;

    return `
      <!doctype html>
      <html>
        <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8" />
          ${cssLibraries}
        <title>Invoice - Acal Software Limited</title>
        </head>
        <body>
          <div id="app">${content}</div>
          ${externalJs}
          <script>window.__initialState__ = ${JSON.stringify(store.getState()).replace(/</g, '\\x3c')}</script>
          <script src="http://localhost:${port}/dist/invoice.js"></script>
        </body>
      </html>
      `;
  }

  function getActiveFeatureToggles(req) {
    const params = qs.parse(req.query);
    return params['feature-toggles'] !== undefined ? _.compact(params['feature-toggles']) : req.cookies.featureToggles || [];
  }

  router.get('/*', (req, res) => {
    const activeFeatureToggles = getActiveFeatureToggles(req);
    res.cookie('featureToggles', activeFeatureToggles);
    const activeInvoiceId = (uiUrlPattern.match(req.url) || {}).activeInvoiceId;
    const downloadInvoice = qs.parse(req.query)['download-invoice'] !== undefined;

    return invoiceStore.find({})
      .then((invoices) => {
        const preloadedState = {
          [NAMESPACE]: {
            meta: {
              featureToggles: activeFeatureToggles,
              downloadInvoice,
            },
            invoice: {
              activeInvoiceId,
              all: invoices,
              company: companyData,
              client: invoiceData.client,
              invoiceStyle,
              invoiceItems: invoiceData.invoiceItems,
              invoiceNumber: invoiceData.invoiceNumber,
            },
          },
        };
        const memoryHistory = createMemoryHistory(req.url);
        const store = configureStore(memoryHistory, preloadedState);
        const history = syncHistoryWithStore(memoryHistory, store);

        match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
          if (error) {
            res.status(500).send(error.message);
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          } else if (renderProps) {
            const content = renderToString(
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>
            );
            res.send(renderFullPage(content, store, downloadInvoice));
          }
        });
      });
  });

  return router;
};