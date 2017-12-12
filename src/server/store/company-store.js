import config from '../config';

const company = {
  name: { type: String, index: { unique: true } },
  vatNumber: { type: String, index: { unique: true } },
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
  bankAccount: {
    number: String,
    sortCode: String,
  },
  registrationNumber: { type: String, index: { unique: true } },
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.companyCollection, company);

  function findOne(query) {
    return Model.findOne(query)
      .then((client) => client.toJSON());
  }

  function find(query) {
    return Model.find(query)
      .then((clients) => clients.map((client) => client.toJSON()));
  }


  return Object.freeze({
    findOne,
    find,
  });
};
