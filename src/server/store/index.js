import bluebird from 'bluebird';
import mongoose from 'mongoose';

// import { invoiceStoreInit, invoiceStoreSchema, INVOICE_STORE_COLLECTION } from './invoice-store';
import invoiceStoreFactory from './invoice-store';
import clientStoreFactory from './client-store';

// const InvoiceModel = mongoose.model(INVOICE_STORE_COLLECTION, invoiceStoreSchema);

export default () => {
  mongoose.Promise = bluebird;

  function init() {
    return mongoose.connect('mongodb://localhost/invoice', { useMongoClient: true })
      .then(() => ({
        invoiceStore: invoiceStoreFactory(mongoose),
        clientStore: clientStoreFactory(mongoose),
      }));
  }

  return Object.freeze({
    init,
  });
};
