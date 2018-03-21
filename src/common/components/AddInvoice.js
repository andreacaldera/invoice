import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddInvoiceForm from './AddInvoiceForm';

const AddInvoice = ({ displayInvoice }) => (
  <div>
    <h1>Add a new invoice</h1>
    <AddInvoiceForm
      displayInvoice={displayInvoice}
    />
  </div>
);

AddInvoice.propTypes = {
  displayInvoice: PropTypes.func,
};

export default connect(null, null)(AddInvoice);
