import winston from 'winston';

import companyData from '../private/companyData.json';

if (!process.env.INVOICE_CONFIG) {
  winston.error('Config INVOICE_CONFIG must be defined for data import');
  process.exit(1);
}

import storesFactory from '../src/server/store'; // eslint-disable-line

winston.info('Importing data...');

const ensureCompanyData = (companyStore) =>
  companyStore.findOne({ name: 'Acal Software Ltd' })
    .then((company) => {
      if (company) {
        winston.info('Company data already configured, skipping');
        return;
      }
      return companyStore.save(companyData
    )
    .then(() => winston.info('Company added successfully'));
    });

const ensureClientData = (clientStore) =>
  clientStore.findOne({ name: 'TODO' })
    .then((client) => {
      if (client) {
        winston.info('Client data already configured, skipping');
        return;
      }
      return clientStore.save()
      .then(() => winston.info('Client added successfully'));
    });

storesFactory()
  .then(({ clientStore, companyStore }) =>
    Promise.all([ensureCompanyData(companyStore), ensureClientData(clientStore)])
  )
  .then(() => process.exit(0))
  .catch((err) => {
    winston.error('Unable to import data', err);
    process.exit(1);
  });
