import { v1 } from 'uuid';

export default (Model) => {
  // TODO index on invoiceId
  function save(invoiceData) {
    const invoice = new Model();
    invoice.invoiceId = v1();
    invoice.companyName = invoiceData.companyName;
    invoice.billings = invoiceData.billings;
    invoice.invoiceNumber = invoiceData.invoiceNumber;
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
