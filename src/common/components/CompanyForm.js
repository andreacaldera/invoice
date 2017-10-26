import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

export default class CompanyForm extends Component {
  static propTypes = {
    company: PropTypes.shape().isRequired,
    saveCompany: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    company: this.props.company,
    panelVisible: false,
  }

  updateClient(e, field) {
    e.preventDefault();
    this.setState({ company: Object.assign({}, this.state.company, { [field]: e.target.value }) });
  }

  togglePanelVisibility() {
    const panelVisible = !this.state.panelVisible;
    this.setState({ panelVisible });
  }

  saveCompany(e) {
    e.preventDefault();
    const { company } = this.state;
    this.props.saveCompany({ company });
    this.setState({ panelVisible: false });
  }

  render() {
    return (
      <div className="collapsible-panel">
        <div className="collapsible-panel__header">
          <h3 className="mb-1 collapsible-panel__title">Company ({this.props.company.name})</h3>
          <input className="pull-right btn btn-primary btn-sm float-right" type="button" value={this.state.panelVisible ? 'Cancel' : 'Edit'} onClick={this.togglePanelVisibility} />
        </div>
        <div className={`collapsible-panel__inner-panel ${this.state.panelVisible ? '' : 'sr-only'}`}>
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
          <input className="btn btn-primary" type="submit" value="Save" onClick={this.saveCompany} />
        </div>
      </div>
    );
  }
}
