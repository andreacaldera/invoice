import { v1 } from 'uuid';

const schema = {
  invoiceId: String,
  companyName: String,
  billings: [{
    description: String,
    numberOfDays: Number,
    dailyRate: Number,
  }],
  invoiceNumber: String,
  client: {
    name: String,
    addressLine1: String,
    addressLine2: String,
    addressLine3: String,
  },
};

export default (mongoose) => {
  const Model = mongoose.model('invoice', schema);

  // TODO index on invoiceId
  function save(invoiceData) {
    const invoice = new Model();
    Object.assign(invoice, invoiceData, { invoiceId: v1() });
    return invoice.save();
  }

  function findOne(query) {
    return Model.findOne(query);
  }

  function find(query) {
    return Model.find(query);
  }

  return Object.freeze({
    save,
    findOne,
    find,
  });
};