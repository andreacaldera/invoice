import bluebird from 'bluebird';
import mongoose from 'mongoose';

import invoiceStoreFactory from './invoice-store';

const InvoiceModel = mongoose.model('invoice', {
  invoiceId: String,
  companyName: String,
  billings: [{
    description: String,
    numberOfDays: Number,
    dailyRate: Number,
  }],
  invoiceNumber: String,
});

export default () => {
  mongoose.Promise = bluebird;

  function init() {
    return mongoose.connect('mongodb://localhost/invoice', { useMongoClient: true })
      .then(() => ({
        invoiceStore: invoiceStoreFactory(InvoiceModel),
      }));
  }

  return Object.freeze({
    init,
  });
};
