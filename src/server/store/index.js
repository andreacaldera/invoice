import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from '../config';

import invoiceStoreFactory from './invoice-store';
import clientStoreFactory from './client-store';
import companyStoreFactory from './company-store';

export default () => {
  mongoose.Promise = bluebird;

  return mongoose.connect(config.mongodb.url, { useMongoClient: true })
    .then(() => ({
      invoiceStore: invoiceStoreFactory({ mongoose }),
      clientStore: clientStoreFactory({ mongoose }),
      companyStore: companyStoreFactory({ mongoose }),
    }));
};
