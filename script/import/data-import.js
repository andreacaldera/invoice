import winston from 'winston';

import companyData from '../../private/company-data.json';
import clientData from '../../private/client-data.json';

if (!process.env.INVOICE_CONFIG) {
  winston.error('Config INVOICE_CONFIG must be defined for data import');
  process.exit(1);
}

import storesFactory from '../../src/server/store'; // eslint-disable-line

winston.info('Importing data...');

const ensureCompanyData = (companyStore) =>
  Promise.all(companyData.map((company) =>
    companyStore.findOne({ name: company.name })
      .then((existingCompany) => {
        if (existingCompany) {
          winston.info(`Company ${company.name} already configured, skipping`);
          return;
        }
        return companyStore.save(company)
          .then(() => winston.info(`Company ${company.name} added successfully`));
      })));

const ensureClientData = (clientStore) =>
  Promise.all(clientData.map((client) =>
    clientStore.findOne({ name: 'Allegis Group' })
      .then((existingClient) => {
        if (existingClient) {
          winston.info(`Client ${client.name} already configured, skipping`);
          return;
        }
        return clientStore.save(client)
          .then(() => winston.info(`Client ${client.name} added successfully`));
      })));

storesFactory()
  .then(({ clientStore, companyStore }) =>
    Promise.all([ensureCompanyData(companyStore), ensureClientData(clientStore)]))
  .then(() => process.exit(0))
  .catch((err) => {
    winston.error('Unable to import data', err);
    process.exit(1);
  });
