const schema = {
  invoiceId: String,
  companyName: String,
  billings: [{
    description: String,
    numberOfDays: Number,
    dailyRate: Number,
  }],
  invoiceNumber: String,
};

export default (mongoose) => {
  const Model = mongoose.model('client', schema);

  // TODO index on clientId
  function save() {
    const client = new Model();

    return client.save();
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
