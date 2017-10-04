import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

import ClientForm from './ClientForm';

export default class AddInvoiceForm extends Component {
  static propTypes = {
    company: PropTypes.shape().isRequired,
    client: PropTypes.shape().isRequired,
    dailyRate: PropTypes.number,
    numberOfDays: PropTypes.number,
    displayInvoice: PropTypes.func.isRequired,
    addInvoice: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    company: this.props.company,
    client: this.props.client,
    billing: {},
  }

  updateCompany(e, field) {
    e.preventDefault();
    this.setState({ company: Object.assign({}, this.state.company, { [field]: e.target.value }) });
  }

  updateClient({ client }) {
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
    const { company, client, billing, invoiceNumber } = this.state;
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

          <h3>Company</h3>
          <div className="form-group row">
            <label htmlFor="companyName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.name} onChange={(e) => this.updateCompany(e, 'name')} className="form-control" id="companyName" placeholder="Name" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="companyAddressLine1" className="col-sm-2 col-form-label">Address line 1</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.addressLine1} onChange={(e) => this.updateCompany(e, 'addressLine1')} className="form-control" id="companyAddressLine1" placeholder="Line 1" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="companyAddressLine2" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.addressLine2} onChange={(e) => this.updateCompany(e, 'addressLine2')} className="form-control" id="companyAddressLine2" placeholder="Address line 2" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="companyAddressLine3" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.addressLine3} onChange={(e) => this.updateCompany(e, 'addressLine3')} className="form-control" id="companyAddressLine3" placeholder="Address line 3" />
            </div>
          </div>

          <ClientForm
            client={this.props.client}
            saveClient={this.updateClient}
          />

          <div className="form-group row">
            <input className="btn btn-primary" type="submit" value="Create invoice" onClick={this.addInvoice} />
          </div>
        </form>
      </div>
    );
  }
}
