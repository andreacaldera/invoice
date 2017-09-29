import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddInvoiceForm from './AddInvoiceForm';

import invoice from '../modules/invoice';
import { ADD_INVOICE, DISPLAY_INVOICE } from '../modules/invoice/constants';

const AddInvoice = ({ company, client, displayInvoice, addInvoice }) =>
  (<div>
    <h1>Add a new invoice</h1>
    <AddInvoiceForm
      company={company}
      client={client}
      displayInvoice={displayInvoice}
      addInvoice={addInvoice}
    />
  </div>);

const mapStateToProps = (state) => ({
  company: invoice.getCompany(state),
  client: invoice.getClient(state),
});

AddInvoice.propTypes = {
  company: PropTypes.shape().isRequired, // TODO
  client: PropTypes.shape().isRequired, // TODO
  displayInvoice: PropTypes.func.isRequired,
  addInvoice: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  displayInvoice(invoiceData) {
    dispatch({ type: DISPLAY_INVOICE, invoiceData });
  },
  addInvoice(invoiceData) {
    dispatch({ type: ADD_INVOICE, invoiceData });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoice);