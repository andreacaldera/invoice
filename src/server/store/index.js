import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from '../config';

// import { invoiceStoreInit, invoiceStoreSchema, INVOICE_STORE_COLLECTION } from './invoice-store';
import invoiceStoreFactory from './invoice-store';
import clientStoreFactory from './client-store';

// const InvoiceModel = mongoose.model(INVOICE_STORE_COLLECTION, invoiceStoreSchema);

export default () => {
  mongoose.Promise = bluebird;

  return mongoose.connect(config.mongodb.url, { useMongoClient: true })
    .then(() => ({
      invoiceStore: invoiceStoreFactory({ mongoose }),
      clientStore: clientStoreFactory({ mongoose }),
    }));
};
