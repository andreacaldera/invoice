import winston from 'winston';
import fs from 'fs';
import moment from 'moment';
import { omit } from 'lodash';

if (!process.env.INVOICE_CONFIG) {
  winston.error('Config INVOICE_CONFIG must be defined for data import');
  process.exit(1);
}

import storesFactory from '../../src/server/store'; // eslint-disable-line

winston.info('Exporting data...');

const save = (filename, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

const exportClientData = (clientStore) =>
  clientStore.find()
    .then((clients) => save(`./private/client-data-${moment().toISOString()}.json`, clients.map((client) => omit(client, ['_id', '__v']))))
    .then(() => winston.info('Clients exported successfully'));

storesFactory()
  .then(({ clientStore }) =>
    Promise.all([exportClientData(clientStore)])
  )
  .then(() => process.exit(0))
  .catch((err) => {
    winston.error('Unable to export data', err);
    process.exit(1);
  });
