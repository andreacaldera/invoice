const Browser = require('zombie');
const assert = require('chai').assert;
const async = require('async');
const setup = require('./setup');
const step = require('./step');
const pdf = require('./pdf');

require('mongoose').connect('mongodb://localhost/invoice');
const userService = require('../app/service/user-service');

const InvoiceConfig = require('../app/model/invoice-config');

Browser.localhost('localhost', 3031);
const browser = new Browser();

describe('A user', () => {
  const email = 'some@email.com';
  const password = 'password';
  const companyName = 'Some Company Ltd';

  before('application start-up', setup.applicationStartUp);

  before('add user', (done) => {
    async.series([
      (callback) => userService.add(email, password, callback),
      (callback) => {
        InvoiceConfig.put({
          email,
          fields: [
                        { placeholder: 'vatNumber', label: 'vat number', value: '00112233' },
                        { placeholder: 'companyName', label: 'company name', value: companyName },
                        { placeholder: 'consultant', label: 'consultant', value: 'Name Surname' },
                        { placeholder: 'rate', label: 'rate', value: '200' },
                        { placeholder: 'description', label: 'description', value: 'Description 1' },
            {
              placeholder: 'companyAddressLine1',
              label: 'company address line 1',
              value: 'Some Address',
            },
            {
              placeholder: 'companyAddressLine2',
              label: 'company address line 2',
              value: '4, Some Road',
            },
            {
              placeholder: 'companyAddressLine3',
              label: 'company address line 3',
              value: 'E1 211 - London',
            },
            {
              placeholder: 'companyAccountNumber',
              label: 'company account number',
              value: '00112233',
            },
            {
              placeholder: 'companyAccountSortCode',
              label: 'company account sort code',
              value: '11-22-33',
            },
            {
              placeholder: 'companyRegistrationNumber',
              label: 'company registration number',
              value: '0123456',
            },
            {
              placeholder: 'recipient',
              label: 'recipient',
              value: 'Your Client',
            },
            {
              placeholder: 'recipientAddress',
              label: 'recipient address',
              value: '30, Another Street',
            },
            {
              placeholder: 'recipientPostCode',
              label: 'recipient post code',
              value: 'N11 3AA',
            },
            {
              placeholder: 'recipientTown',
              label: 'recipient town',
              value: 'London',
            },
          ],
        }, callback);
      },
    ], done);
  });

  it('should able to generate an invoice PDF', (done) => {
    async.series([
      (callback) => step.login(browser, email, password, callback),
      (callback) => step.invoicePage(browser, callback),
      (callback) => {
        browser.fill('description', 'description 1');
        browser.fill('days', 2);
        browser.fill('rate', 10);
        browser.fill('invoiceNumber', 1);
        callback();
      },
      (callback) => browser.pressButton('#preview-button', callback),
      (callback) => {
        browser.assert.success();
        browser.assert.text('.invoice-row .description', 'description 1');
        browser.assert.text('.invoice-row .days', 2);
        browser.assert.text('.invoice-row .rate', '£10.00');
        browser.assert.text('.invoice-row .amount', '£20.00');
        callback();
      },
      (callback) => {
        browser.clickLink('#download-pdf', () => {
          browser.assert.success();
          callback();
        });
      },
      (callback) => {
        pdf.loadPdf(browser, (pdfContent) => {
          const spaces = new RegExp(' ', 'g');
          assert.include(pdfContent.replace(spaces, '').toLowerCase(), companyName.replace(spaces, '').toLowerCase()); // todo fix whitespaces issue when reading pdf
          assert.notInclude(pdfContent.replace(spaces, '').toLowerCase(), 'download');
          callback();
        });
      },
    ], done);
  });
});
