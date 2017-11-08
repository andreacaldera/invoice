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
    billing: {},
  }

  updateCompany({ company }) {
    this.setState({ company });
  }

  selectClient(client) {
    this.setState({ client });
  }

  updateBilling(e, field) {
    e.preventDefault();
    this.setState({ billing: Object.assign({}, this.state.billing, { [field]: e.target.value }) });
  }

  updateInvoiceNumber(e) {
    e.preventDefault();
    this.setState({ invoiceNumber: e.target.value });
  }

  addInvoice(e) {
    e.preventDefault();
    const { company, billing, invoiceNumber, client } = this.state;
    this.props.addInvoice({ company, client, billing, invoiceNumber });
  }

  render() {
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
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.billing.description} onChange={(e) => this.updateBilling(e, 'description')} className="form-control" id="numberOfDays" placeholder="Description" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="numberOfDays" className="col-sm-2 col-form-label">Number of days</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.billing.numberOfDays} onChange={(e) => this.updateBilling(e, 'numberOfDays')} className="form-control" id="numberOfDays" placeholder="Number of days" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="dailyRate" className="col-sm-2 col-form-label">Daily rate</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.billing.dailyRate} onChange={(e) => this.updateBilling(e, 'dailyRate')} className="form-control" id="dailyRate" placeholder="Daily rate" />
            </div>
          </div>

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
