/* eslint react/no-danger: 0 */

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import accounting from 'accounting';
import _ from 'lodash';

import invoiceModule from '../modules/invoice';

const InvoicePreview = ({ invoice, invoiceStyle }) => {
  const today = moment().format('DD/MMM/YYYY');
  const formatAmount = (amount) => accounting.formatMoney(amount, '£');

  // TODO move all this logic away
  const invoiceTotal = _.reduce(invoice.billings, (total, { numberOfDays, dailyRate }) => total + (dailyRate * numberOfDays), 0);
  const invoiceVat = invoiceTotal * 0.20;
  const billableTotal = invoiceTotal + invoiceVat;

  const invoiceRows = invoice.billings.map(({ description, numberOfDays, dailyRate }) => {
    const amount = dailyRate * numberOfDays;
    const vat = dailyRate * numberOfDays * 0.20;
    return (
      <tr className="block invoice-row" key={`invoice-row-${description}-${numberOfDays}-${dailyRate}`}>
        <td colSpan="2" className="description">{description}</td>
        <td className="days">{numberOfDays}</td>
        <td className="rate">{formatAmount(dailyRate)}</td>
        <td className="amount">{formatAmount(amount)}</td>
        <td className="vat">{formatAmount(vat)}</td>
      </tr>
    );
  });

  const rowSeparatorTop = (
    <tr>
      <td colSpan="6" className="border-bottom pt-2" />
    </tr>
  );

  const rowSeparatorBottom = (
    <tr>
      <td colSpan="6" className="pt-2" />
    </tr>
  );

  return (
    <div className="invoice-container">
      <style dangerouslySetInnerHTML={{ __html: invoiceStyle }} />

      <table className="invoice-container__table">
        <tbody>
          <tr>
            <td rowSpan="10" colSpan="3" className="company-title">{invoice.company.name}</td>
            <td colSpan="3" className="pb-3 invoice-title" style={{ textAlign: 'right' }}>INVOICE</td>
          </tr>


          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}><strong>{invoice.company.name}</strong></td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>
              <span className="pdf-label">Company registration number: </span>{invoice.company.registrationNumber}
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>{invoice.company.addressLine1}</td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>{invoice.company.addressLine2}</td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>{invoice.company.addressLine3}</td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}><strong>Please remit to:</strong></td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>
              <span className="pdf-label">Bank name: {invoice.company.bankName}</span>
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>
              <span className="pdf-label">Sort code: </span>{invoice.company.bankAccountSortCode}
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={{ textAlign: 'right' }}>
              <span className="pdf-label">Number: </span>{invoice.company.bankAccountNumber}
            </td>
          </tr>


          {rowSeparatorTop}
          {rowSeparatorBottom}

          <tr>
            <td colSpan="3" className="pdf-label">Invoice to</td>
            <td colSpan="3" style={{ textAlign: 'right' }}><span className="pdf-label">Invoice number: </span><span>{invoice.invoiceNumber}</span></td>
          </tr>
          <tr>
            <td colSpan="3"><strong>{invoice.client.name}</strong></td>
            <td colSpan="3" style={{ textAlign: 'right' }}><span className="pdf-label">Date: </span><span>{today}</span></td>
          </tr>
          <tr>
            <td colSpan="3">{invoice.client.addressLine1}</td>
            <td colSpan="3" style={{ textAlign: 'right' }}><span className="pdf-label">Consultant: </span><span>Andrea Caldera</span></td>
          </tr>
          <tr>
            <td colSpan="3">{invoice.client.addressLine2}</td>
            <td rowSpan="2" colSpan="3" style={{ textAlign: 'right' }}><strong><span className="pdf-label">Amount due: </span><span>{formatAmount(billableTotal)}</span></strong></td>
          </tr>
          <tr>
            <td colSpan="3">{invoice.client.addressLine3}</td>
          </tr>

          {rowSeparatorTop}
          {rowSeparatorBottom}

          <tr>
            <td colSpan="2" className="pdf-label">Description</td>
            <td className="pdf-label">Days</td>
            <td className="pdf-label">Rate (£/day)</td>
            <td className="pdf-label">Amount</td>
            <td className="pdf-label">VAT (20%)</td>
          </tr>

          {rowSeparatorTop}
          {rowSeparatorBottom}

          {invoiceRows}

          {rowSeparatorTop}
          {rowSeparatorBottom}

          <tr>
            <td />
            <td />
            <td colSpan="2" className="total-label pdf-label">Total</td>
            <td className="total"><strong>{formatAmount(invoiceTotal)}</strong></td>
            <td />
          </tr>

          <tr>
            <td />
            <td />
            <td colSpan="2" className="total-label  pdf-label">VAT ({invoice.company.vatNumber})</td>
            <td>{formatAmount(formatAmount(invoiceVat))}</td>
            <td />
          </tr>

          <tr>
            <td />
            <td />
            <td colSpan="2" className="total-label pdf-label">Invoice Total</td>
            <td className="invoice-total"><strong>{formatAmount(billableTotal)}</strong></td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

InvoicePreview.propTypes = {
  invoice: PropTypes.shape().isRequired, // TODO
  invoiceStyle: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  invoice: invoiceModule.getActiveInvoice(state),
  invoiceStyle: invoiceModule.getInvoiceStyle(state),
});

export default connect(mapStateToProps, null)(InvoicePreview);
