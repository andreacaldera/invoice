import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import invoiceModule from '../modules/invoice';

const Invoices = ({ invoices }) =>
  (<div>
    <h1>Invoices</h1>
    <div className="container">
      {invoices.map((invoiceData) => (
        <div className="row text-right invoice-row" key={invoiceData.invoiceId}>
          <div className="col invoices__invoice-id-text">Invoice {invoiceData.invoiceNumber || invoiceData.invoiceId}</div>
          <div className="col col-9 text-left">
            <a className="btn btn-primary" href={`/invoice-preview/${invoiceData.invoiceId}`}>View</a>
            <a className="btn btn-primary ml-2" download={`${invoiceData.invoiceId}-invoice.pdf`} href={`/api/download-invoice/${invoiceData.invoiceId}`}>Download</a>
            <a className="btn btn-primary ml-2" target={`_download-preview-${invoiceData.invoiceId}`} href={`/invoice-preview/${invoiceData.invoiceId}?download-invoice`}>Download preview</a>
          </div>
        </div>
      ))}
    </div>
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
