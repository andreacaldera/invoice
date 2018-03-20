import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

import ClientForm from './ClientForm';
import CompanyForm from './CompanyForm';

import clientModule from '../modules/client';
import invoiceModule from '../modules/invoice';

import { ADD_INVOICE } from '../modules/invoice/constants';

class AddInvoiceForm extends Component {
  static propTypes = {
    company: PropTypes.shape().isRequired,
    clients: PropTypes.shape().isRequired,
    selectedClient: PropTypes.shape(),
    dailyRate: PropTypes.number,
    numberOfDays: PropTypes.number,
    addInvoice: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    company: this.props.company,
    client: this.props.selectedClient,
    billings: [{
      description: '',
      numberOfDays: '',
      dailyRate: '',
    }],
  }

  updateCompany({ company }) {
    this.setState({ company });
  }

  selectClient(client) {
    this.setState({ client });
  }

  updateBilling(e, field, index) {
    e.preventDefault();
    const { billings } = this.state;
    billings[index] = Object.assign({}, billings[index], { [field]: e.target.value });
    this.setState({ billings });
  }

  updateInvoiceNumber(e) {
    e.preventDefault();
    this.setState({ invoiceNumber: e.target.value });
  }

  addInvoice(e) {
    e.preventDefault();
    const { company, billings, invoiceNumber, client } = this.state;
    this.props.addInvoice({ company, client, billings, invoiceNumber });
  }

  addInvoiceItem(e) {
    e.preventDefault();
    this.setState({ billings: this.state.billings.concat({ description: '', numberOfDays: '', dailyRate: '' }) });
  }

  removeInvoiceItem(e, index) {
    e.preventDefault();
    this.setState({ billings: this.state.billings.filter((billing, i) => i !== index) });
  }

  render() {
    const InvoiceItems = this.state.billings.map((invoiceItem, index) => {
      const billingItemKey = `billing-item-${index}`;
      return (<div className="form-group form-inline row" key={billingItemKey}>
        <div className="col-3">
          <input type="text" value={invoiceItem.description} onChange={(e) => this.updateBilling(e, 'description', index)} className="form-control" id="numberOfDays" placeholder="Description" />
        </div>
        <div className="col-3">
          <input type="text" value={invoiceItem.numberOfDays} onChange={(e) => this.updateBilling(e, 'numberOfDays', index)} className="form-control" id="numberOfDays" placeholder="Number of days" />
        </div>
        <div className="col-3">
          <input type="text" value={invoiceItem.dailyRate} onChange={(e) => this.updateBilling(e, 'dailyRate', index)} className="form-control" id="dailyRate" placeholder="Daily rate" />
        </div>
        <div className="col-3">
          <button className="btn btn-secondary" onClick={(e) => this.removeInvoiceItem(e, index)}>Remove item</button>
        </div>
      </div>);
    });
    return (
      <div>
        <form>
          <h3>Invoice</h3>
          <div className="form-group row">
            <label htmlFor="invoiceNumber" className="col-sm-2 col-form-label">Invoice number</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.invoiceNumber} onChange={(e) => this.updateInvoiceNumber(e)} className="form-control" id="numberOfDays" placeholder="Invoice number" />
            </div>
          </div>

          <h3>Billing</h3>
          {InvoiceItems}

          <button className="btn btn-secondary mb-3" onClick={this.addInvoiceItem}>Add item</button>

          <CompanyForm
            company={this.props.company}
            saveCompany={this.updateCompany}
          />

          <ClientForm
            clients={this.props.clients}
            selectedClient={this.props.selectedClient}
            selectClient={this.selectClient}
          />

          <div className="form-group row">
            <input className="btn btn-primary ml-3" type="submit" value="Create invoice" onClick={this.addInvoice} />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  company: invoiceModule.getCompany(state),
  clients: clientModule.getAllClients(state),
  selectedClient: clientModule.getSelectedClient(state),
});

const mapDispatchToProps = (dispatch) => ({
  addInvoice(invoiceData) {
    dispatch({ type: ADD_INVOICE, invoiceData });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoiceForm);
