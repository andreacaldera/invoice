const Browser = require('zombie');
var assert = require('chai').assert;
var async = require('async');
var setup = require('./setup');
var step = require('./step');
var pdf = require('./pdf');

var request = require('request');
var _ = require('underscore');

require('mongoose').connect('mongodb://localhost/invoice');
var userService = require('../app/service/user-service');

Browser.localhost('localhost', 3031);
const browser = new Browser();

describe('A user', function () {

    var email = 'some@email.com';
    var password = 'password';
    var companyName = 'Some Company Ltd';

    before('application start-up', setup.applicationStartUp);

    before('add user', function (done) {
        async.series([
            function (callback) {
                userService.add(email, password, callback)
            },
            function (callback) {
                var InvoiceConfig = require('../app/model/invoice-config');
                InvoiceConfig.put({
                    email: email,
                    fields: [
                        {placeholder: 'vatNumber', label: 'vat number', value: '00112233'},
                        {placeholder: 'companyName', label: 'company name', value: companyName},
                        {placeholder: 'consultant', label: 'consultant', value: 'Name Surname'},
                        {placeholder: 'rate', label: 'rate', value: '200'},
                        {placeholder: 'description', label: 'description', value: 'Description 1'},
                        {
                            placeholder: 'companyAddressLine1',
                            label: 'company address line 1',
                            value: 'Some Address'
                        },
                        {
                            placeholder: 'companyAddressLine2',
                            label: 'company address line 2',
                            value: '4, Some Road'
                        },
                        {
                            placeholder: 'companyAddressLine3',
                            label: 'company address line 3',
                            value: 'E1 211 - London'
                        },
                        {
                            placeholder: 'companyAccountNumber',
                            label: 'company account number',
                            value: '00112233'
                        },
                        {
                            placeholder: 'companyAccountSortCode',
                            label: 'company account sort code',
                            value: '11-22-33'
                        },
                        {
                            placeholder: 'companyRegistrationNumber',
                            label: 'company registration number',
                            value: '0123456'
                        },
                        {
                            placeholder: 'recipient',
                            label: 'recipient',
                            value: 'Your Client'
                        },
                        {
                            placeholder: 'recipientAddress',
                            label: 'recipient address',
                            value: '30, Another Street'
                        },
                        {
                            placeholder: 'recipientPostCode',
                            label: 'recipient post code',
                            value: 'N11 3AA'
                        },
                        {
                            placeholder: 'recipientTown',
                            label: 'recipient town',
                            value: 'London'
                        }
                    ]
                }, callback)
            }
        ], done);
    });

    it('should able to generate an invoice PDF', function (done) {
        async.series([
            function (callback) {
                step.login(browser, email, password, callback)
            },
            function (callback) {
                step.invoicePage(browser, callback)
            },
            function (callback) {
                browser.fill('description', 'description 1');
                browser.fill('days', 2);
                browser.fill('rate', 10);
                browser.fill('invoiceNumber', 1);
                callback();
            },
            function (callback) {
                browser.pressButton('#preview-button', callback);
            },
            function (callback) {
                browser.assert.success();
                browser.assert.text('.invoice-row .description', 'description 1');
                browser.assert.text('.invoice-row .days', 2);
                browser.assert.text('.invoice-row .rate', '£10.00');
                browser.assert.text('.invoice-row .amount', '£20.00');
                callback();
            },
            function( callback) {
                browser.clickLink('#download-pdf', function() {
                    browser.assert.success();
                    callback();
                })
            },
            function (callback) {
                pdf.loadPdf(browser, function(pdfContent) {
                    var spaces = new RegExp(' ', 'g');
                    pdfContent = pdfContent.replace(spaces, '').toLowerCase();
                    assert.include(pdfContent, companyName.replace(spaces, '').toLowerCase()); // todo fix whitespaces issue when reading pdf
                    assert.notInclude(pdfContent, 'download');
                    callback();
                })
            }
        ], done);
    });

});