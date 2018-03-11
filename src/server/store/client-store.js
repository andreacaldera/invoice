import winston from 'winston';

import config from '../config';

const schema = {
  name: { type: String, index: { unique: true } },
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.clientCollection, schema);

  function save(clientData) {
    const client = new Model();
    Object.assign(client, clientData);
    return client.save()
      .then((savedClient) => savedClient.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query)
      .then((client) => client && client.toJSON())
      .catch((err) => winston.error('Unable to find client', err));
  }

  function find(query) {
    return Model.find(query)
      .then((clients) => clients.map((client) => client.toJSON()));
  }


  return Object.freeze({
    save,
    findOne,
    find,
  });
};
