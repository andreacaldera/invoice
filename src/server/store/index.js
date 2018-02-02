import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from '../config';

import invoiceStoreFactory from './invoice-store';
import clientStoreFactory from './client-store';
import companyStoreFactory from './company-store';

export default () => {
  mongoose.Promise = bluebird;

  const url = `mongodb://${config.mongodb.user}:${process.env.MONGODB_PASSWORD}@${config.mongodb.hosts}/${config.mongodb.database}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;

  return mongoose.connect(url, { useMongoClient: true })
    .then(() => ({
      invoiceStore: invoiceStoreFactory({ mongoose }),
      clientStore: clientStoreFactory({ mongoose }),
      companyStore: companyStoreFactory({ mongoose }),
    }));
};
