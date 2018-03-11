import winston from 'winston';

import config from '../config';

const schema = {
  name: { type: String, index: { unique: true } },
  vatNumber: { type: String, index: { unique: true } },
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
  bankName: String,
  bankAccountNumber: String,
  bankAccountSortCode: String,
  registrationNumber: { type: String, index: { unique: true } },
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.companyCollection, schema);

  function save(companyData) {
    const company = new Model();
    Object.assign(company, companyData);
    return company.save()
      .then((savedCompany) => savedCompany.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query)
      .then((company) => company && company.toJSON())
      .catch((err) => winston.error('Unable to find company', err));
  }

  function find(query) {
    return Model.find(query)
      .then((companies) => companies.map((client) => client.toJSON()));
  }


  return Object.freeze({
    save,
    findOne,
    find,
  });
};
