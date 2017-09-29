import superagent from 'superagent';
import { expect } from 'chai';
import _ from 'lodash';

import server from '../../src/server/server';

let invoiceStore;

before(() =>
  server()
    .then(({ stores }) => {
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
    const client = {
      name: 'Some client Ltd',
      addressLine1: '1, Some Road',
      addressLine2: 'E1 2AA',
      addressLine3: 'London',
    };
    const invoiceNumber = 'SOME-CLIENT-XXX';

    return superagent.post('http://localhost:3001/api/invoices/add-invoice')
      .send({ companyName, billings: [billing], invoiceNumber, client })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        // expect(res.body._id).to.be.not.ok;
        // expect(res.body.__v).to.be.not.ok;
        expect(res.body.invoiceId).to.be.ok;
        expect(res.body.companyName).to.equal(companyName);
        expect(res.body.invoiceNumber).to.equal(invoiceNumber);
        // TODO remove billing[_id] being returned by api
        expect(_.pick(res.body.billings[0], ['description', 'numberOfDays', 'dailyRate']));
        expect(res.body.client).to.deep.equal(client);

        return invoiceStore.findOne({ invoiceId: res.body.invoiceId });
      })
      .then((savedInvoice) => {
        expect(savedInvoice.companyName).to.equal(companyName);
        expect(savedInvoice.invoiceNumber).to.equal(invoiceNumber);
        expect(_.pick(savedInvoice.billings[0], ['description', 'numberOfDays', 'dailyRate']));
        expect(_.pick(savedInvoice.client, ['name', 'addressLine1', 'addressLine2', 'addressLine3'])).to.deep.equal(client);
      });
  });
});
