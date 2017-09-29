import superagent from 'superagent';
import { expect } from 'chai';
import storesFactory from '../../src/server/store';

import '../../src/server';

let invoiceStore;

before(() =>
  storesFactory().init()
    .then((stores) => {
      invoiceStore = stores.invoiceStore;
    })
);

describe('Create invoice', () => {
  it('creates an invoice', () => {
    const companyName = 'acal software limited';
    const billing = {
      description: 'Some work done for some client',
      numberOfDays: 1,
      dailyRate: 350,
    };
    const invoiceNumber = 'SOME-CLIENT-XXX';

    return superagent.post('http://localhost:3001/api/invoices/add-invoice')
      .send({ companyName, billings: [billing], invoiceNumber })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        // expect(res.body._id).to.be.not.ok;
        // expect(res.body.__v).to.be.not.ok;
        expect(res.body.companyName).to.equal(companyName);
        expect(res.body.invoiceNumber).to.equal(invoiceNumber);
        // TODO remove billing[_id] being returned by api
        expect(res.body.billings[0]).to.deep.equal(res.body.billings[0], (key) => String(key) === '_id');

        return invoiceStore.findOne({ invoiceId: res.body.invoiceId });
      })
      .then((savedInvoice) => {
        expect(savedInvoice.companyName).to.equal(companyName);
        expect(savedInvoice.invoiceNumber).to.equal(invoiceNumber);
        expect(savedInvoice.billings[0].description).to.deep.equal(billing.description);
      });
  });
});
