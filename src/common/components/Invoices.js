import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import invoiceModule from '../modules/invoice';
// import { ADD_INVOICE, DISPLAY_INVOICE } from '../modules/invoice/constants';

const Invoices = ({ invoices }) =>
  (<div>
    <h1>Invoices</h1>
    <ul>
      {invoices.map((invoiceData) => (
        <li key={invoiceData.invoiceId}>
          Invoice {invoiceData.invoiceNumber || invoiceData.invoiceId}
          <a href={`/invoice-preview/${invoiceData.invoiceId}`}> View </a>
          <a download={`${invoiceData.invoiceId}-invoice.pdf`} href={`/api/download-invoice/${invoiceData.invoiceId}`}>Download </a>
          <a target={`_download-preview-${invoiceData.invoiceId}`} href={`/invoice-preview/${invoiceData.invoiceId}?download-invoice`}>Download preview</a>
        </li>
    ))}
    </ul>
  </div>);

const mapStateToProps = (state) => ({
  invoices: invoiceModule.getAll(state),
});

Invoices.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.shape).isRequired, // TODO
};

// const mapDispatchToProps = (dispatch) => ({
//   displayInvoice(invoiceData) {
//     dispatch({ type: DISPLAY_INVOICE, invoiceData });
//   },
//   addInvoice(invoiceData) {
//     dispatch({ type: ADD_INVOICE, invoiceData });
//   },
// });

export default connect(mapStateToProps, null)(Invoices);
