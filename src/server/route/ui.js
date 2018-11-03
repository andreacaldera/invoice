import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import qs from 'qs';
import StaticRouter from 'react-router-dom/StaticRouter';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import fs from 'fs';
import _ from 'lodash';
import UrlPattern from 'url-pattern';
import { ServerStyleSheet } from 'styled-components';

import configureStore from '../../common/store/configure-store';
import routes from '../../common/routes';
import { NAMESPACE } from '../../common/modules/constants';

const invoiceStyle = fs.readFileSync(
  './style/download-invoice-style.css',
  'utf8'
);

const uiUrlPattern = new UrlPattern('/:page/:activeInvoiceId*');

export default ({ invoiceStore, clientStore, companyStore }) => {
  const router = express.Router();

  function renderFullPage(content, store, sheet, downloadInvoice) {
    const state = JSON.stringify(store.getState()).replace(/</g, '\\x3c');
    const cssLibraries = downloadInvoice
      ? ''
      : `
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="/dist/invoice.css" />
      ${sheet.getStyleTags()}
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
            <script>window.__initialState__ = ${state}</script>
          <script src="/dist/invoice.js"></script>
        </body>
      </html>
      `;
  }

  function getActiveFeatureToggles(req) {
    const params = qs.parse(req.query);
    return params['feature-toggles'] !== undefined
      ? _.compact(params['feature-toggles'])
      : req.cookies.featureToggles || [];
  }

  router.get('/*', (req, res, next) => {
    const activeFeatureToggles = getActiveFeatureToggles(req);
    res.cookie('featureToggles', activeFeatureToggles);
    const { activeInvoiceId } = uiUrlPattern.match(req.url) || {};
    const downloadInvoice =
      qs.parse(req.query)['download-invoice'] !== undefined;

    return Promise.all([
      companyStore.findOne({ name: 'Acal Software Ltd' }),
      invoiceStore.find({}),
      clientStore.find({}),
    ])
      .then(([company, invoices, clients]) => {
        const preloadedState = {
          [NAMESPACE]: {
            meta: {
              featureToggles: activeFeatureToggles,
              downloadInvoice,
              theme: 'main',
            },
            client: {
              allClients: _.keyBy(clients, 'name'),
              selectedClientName: 'Equal Experts UK Limited',
            },
            invoice: {
              activeInvoiceId,
              all: invoices,
              company,
              invoiceStyle,
            },
          },
        };
        const store = configureStore(preloadedState);

        const context = { downloadInvoice };

        const sheet = new ServerStyleSheet();
        const html = renderToString(
          sheet.collectStyles(
            <Provider store={store}>
              <StaticRouter location={req.url} context={context}>
                {renderRoutes(routes)}
              </StaticRouter>
            </Provider>
          )
        );

        res.send(renderFullPage(html, store, sheet, downloadInvoice));
      })
      .catch(next);
  });

  return router;
};
