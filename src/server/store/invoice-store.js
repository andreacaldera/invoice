import { v1 } from 'uuid';
import config from '../config';

const schema = {
  invoiceId: { type: String, index: { unique: true } },
  companyName: String,
  billings: [
    {
      description: String,
      numberOfDays: Number,
      dailyRate: Number,
    },
  ],
  invoiceNumber: String,
  clientName: String,
  client: {
    name: String,
    addressLine1: String,
    addressLine2: String,
    addressLine3: String,
  },
  company: {
    name: String,
    vatNumber: String,
    addressLine1: String,
    addressLine2: String,
    addressLine3: String,
    bankName: String,
    bankAccountNumber: String,
    bankAccountSortCode: String,
    registrationNumber: String,
  },
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.invoiceCollection, schema);

  function save(invoiceData) {
    const invoice = new Model();
    Object.assign(invoice, invoiceData, { invoiceId: v1() });
    return invoice.save().then((savedInvoice) => savedInvoice.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query).then((invoice) => invoice && invoice.toJSON());
  }

  function find(query) {
    return Model.find(query).then((invoices) =>
      invoices.map((invoice) => invoice.toJSON())
    );
  }

  return Object.freeze({
    save,
    findOne,
    find,
    deleteAll: () => {
      if (config.invoiceConfig !== 'test') {
        throw new Error(
          `Delete all is only allowed for testing and not for env ${config.env}`
        );
      }
      return Model.remove({});
    },
  });
};
