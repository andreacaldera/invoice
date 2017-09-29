import Express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';

import storesFactory from './store';
import api from './route/api';
import ui from './route/ui';

const app = Express();
const port = 3001;

app.use(bodyParser.json());

app.use(cookieParser());
app.use('/dist', Express.static(path.join(__dirname, '../../dist')));

storesFactory().init()
  .then(({ invoiceStore }) => {
    app.use('/api', api(invoiceStore));
    app.use(ui(port, invoiceStore));

    app.use((expressError, req, res, next) => { // eslint-disable-line no-unused-vars
      console.error(expressError); // eslint-disable-line no-console
    });

    app.listen(port, (error) => {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      } else {
        console.info(`Invoice running at http://localhost:${port}/`); // eslint-disable-line no-console
      }
    });
  });
