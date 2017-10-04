import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

export default class AddInvoiceForm extends Component {
  static propTypes = {
    company: PropTypes.shape().isRequired,
    updateCompany: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    company: this.props.company,
  }

  render() {
    return (
      <div>
        <form>
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
              <input type="text" value={this.state.company.addressLine1} onChange={(e) => this.props.updateCompany(e, 'addressLine1')} className="form-control" id="companyAddressLine1" placeholder="Line 1" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="companyAddressLine2" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.addressLine2} onChange={(e) => this.props.updateCompany(e, 'addressLine2')} className="form-control" id="companyAddressLine2" placeholder="Address line 2" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="companyAddressLine3" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.company.addressLine3} onChange={(e) => this.props.updateCompany(e, 'addressLine3')} className="form-control" id="companyAddressLine3" placeholder="Address line 3" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
