import superagent from 'superagent';
import { expect } from 'chai';
import _ from 'lodash';

import server from '../../src/server/server';
import config from '../../src/server/config';

let invoiceStore;

before(() =>
  server()
    .then(({ stores }) => {
      invoiceStore = stores.invoiceStore;
    })
);

after(() => invoiceStore.deleteAll());

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
    const company = {
      name: 'Acal Software Ltd',
      vatNumber: '123 vat number',
      addressLine1: 'company address 1',
      addressLine2: 'company address 2',
      addressLine3: 'company address 3',
      bankAccountNumber: 'company bank account number',
      bankAccountSortCode: 'company bank account sort code',
      registrationNumber: 'company registration number',
    };
    const invoiceNumber = 'SOME-CLIENT-XXX';

    return superagent.post(`http://localhost:${config.port}/api/invoices/add-invoice`)
      .send({
        companyName,
        billings: [billing],
        invoiceNumber,
        client,
        company,
      })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.invoiceId).to.be.ok;
        expect(res.body.companyName).to.equal(companyName);
        expect(res.body.invoiceNumber).to.equal(invoiceNumber);
        expect(_.pick(res.body.billings[0], ['description', 'numberOfDays', 'dailyRate']));
        expect(res.body.client).to.deep.equal(client);
        expect(res.body.company).to.deep.equal(company);

        return invoiceStore.findOne({ invoiceId: res.body.invoiceId });
      })
      .then((savedInvoice) => {
        expect(savedInvoice.companyName).to.equal(companyName);
        expect(savedInvoice.invoiceNumber).to.equal(invoiceNumber);
        expect(_.pick(savedInvoice.billings[0], ['description', 'numberOfDays', 'dailyRate']));
        expect(savedInvoice.client).to.deep.equal(client);
        expect(savedInvoice.company).to.deep.equal(company);
      });
  });
});
