import { v1 } from 'uuid';
import config from '../config';

const schema = {
  clientId: { type: String, index: { unique: true } },
  name: { type: String, index: { unique: true } },
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.clientCollection, schema);

  function save(clientData) {
    const client = new Model();
    Object.assign(client, clientData, { clientId: v1() });
    return client.save()
      .then((savedClient) => savedClient.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query)
      .then((client) => client.toJSON());
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
