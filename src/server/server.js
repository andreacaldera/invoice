import Express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';
import winston from 'winston';

import storesFactory from './store';
import api from './route/api';
import ui from './route/ui';
import config from './config';

const app = Express();

app.use(bodyParser.json());

winston.level = config.logLevel;

app.use(cookieParser());
app.use('/dist', Express.static(path.join(__dirname, '../../dist')));

const { port } = config;

export default () =>
  Promise.resolve()
    .then(() => storesFactory())
    .then(({ invoiceStore, clientStore, companyStore }) => {
      app.use('/api', api(invoiceStore));
      app.use(ui({ invoiceStore, clientStore, companyStore }));

      app.use((expressError, req, res, next) => { // eslint-disable-line no-unused-vars
        winston.error('Unable to serve request', expressError);
      });

      app.listen(port, (error) => {
        if (error) {
          winston.error(error);
        } else {
          winston.info(`Invoice running at http://localhost:${port}/`);
        }
      });
      return {
        stores: {
          invoiceStore,
          clientStore,
        },
      };
    })
    .catch((err) => {
      winston.error('Unable to run server', err);
      process.exit(1);
    });
