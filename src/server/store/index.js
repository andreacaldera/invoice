import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from '../config';

import invoiceStoreFactory from './invoice-store';
import clientStoreFactory from './client-store';
import companyStoreFactory from './company-store';

export default () => {
  mongoose.Promise = bluebird;
  const { mongodb } = config;
  const replicaSet = mongodb.replicaSet ? `&replicaSet=${mongodb.replicaSet}` : '';
  const ssl = `ssl=${mongodb.ssl}`;
  const authSource = mongodb.authSource ? `&authSource=${mongodb.authSource}` : '';
  const userAndPassword = mongodb.user ? `${mongodb.user}:${process.env.MONGODB_PASSWORD}@` : '';
  const url = `mongodb://${userAndPassword}${mongodb.hosts}/${mongodb.database}?${ssl}${replicaSet}${authSource}`;

  return mongoose.connect(url, { useMongoClient: true })
    .then(() => ({
      invoiceStore: invoiceStoreFactory({ mongoose }),
      clientStore: clientStoreFactory({ mongoose }),
      companyStore: companyStoreFactory({ mongoose }),
    }));
};
