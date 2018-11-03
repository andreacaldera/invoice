import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import invoiceModule from '../modules/invoice';

const InvoiceIdText = styled.span`
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  color: blue;
`;

const Invoices = ({ invoices }) => (
  <div>
    <h1>Invoices</h1>
    <div className="container">
      {invoices.map((invoiceData) => (
        <div className="row text-right" key={invoiceData.invoiceId}>
          <div className="col-4">
            <InvoiceIdText>
              Invoice {invoiceData.invoiceNumber || invoiceData.invoiceId}
            </InvoiceIdText>
          </div>
          <div className="col-8 text-left">
            <a
              className="btn btn-primary"
              href={`/invoice-preview/${invoiceData.invoiceId}`}
            >
              View
            </a>
            <a
              className="btn btn-primary ml-2"
              download={`${invoiceData.invoiceId}-invoice.pdf`}
              href={`/api/download-invoice/${invoiceData.invoiceId}`}
            >
              Download
            </a>
            <a
              className="btn btn-primary ml-2"
              target={`_download-preview-${invoiceData.invoiceId}`}
              href={`/invoice-preview/${
                invoiceData.invoiceId
              }?download-invoice`}
            >
              Download preview
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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

export default connect(
  mapStateToProps,
  null
)(Invoices);
