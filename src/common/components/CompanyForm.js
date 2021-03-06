import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CollapsiblePanel from './CollapsiblePanel';

export default class CompanyForm extends Component {
  static propTypes = {
    company: PropTypes.shape(),
    saveCompany: PropTypes.func.isRequired,
  }

  static defaultProps = {
    company: {},
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    company: this.props.company,
    panelVisible: false,
  }

  togglePanelVisibility() {
    const panelVisible = !this.state.panelVisible;
    this.setState({ panelVisible });
  }

  updateCompany(e, field) {
    e.preventDefault();
    this.setState({ company: Object.assign({}, this.state.company, { [field]: e.target.value }) });
  }

  saveCompany(e) {
    e.preventDefault();
    const { company } = this.state;
    this.props.saveCompany({ company }); // TODO this should call action, http post, save company
    this.setState({ panelVisible: false });
  }

  render() {
    const HeaderTitle = styled.h3`
      display: inline;
      vertical-align: middle;
      margin-right: 10px;
    `;

    const CompanyFormHeader = (
      <div>
        <HeaderTitle className="mb-1">
          Company - {this.props.company.name}
        </HeaderTitle>
      </div>
    );

    // TODO missing fields: vat number, bank account number and sort code, registration number,
    const CompanyNameFormContent = [
      <div className="form-group row" key="company-form-address">
        <label htmlFor="companyName" className="col-sm-2 col-form-label">Name</label>
        <div className="col-sm-10">
          <input type="text" value={this.state.company.name} autoComplete="companyName" onChange={(e) => this.updateCompany(e, 'name')} className="form-control" id="companyName" placeholder="Name" />
        </div>
      </div>,
      <div className="form-group row" key="company-form-address">
        <label htmlFor="companyAddressLine1" className="col-sm-2 col-form-label">Address line 1</label>
        <div className="col-sm-10">
          <input type="text" value={this.state.company.addressLine1} autoComplete="companyAddressLine1" onChange={(e) => this.updateCompany(e, 'addressLine1')} className="form-control" id="companyAddressLine1" placeholder="Line 1" />
        </div>
      </div>,
      <div className="form-group row">
        <label htmlFor="companyAddressLine2" className="col-sm-2 col-form-label">Address line 2</label>
        <div className="col-sm-10">
          <input type="text" value={this.state.company.addressLine2} autoComplete="companyAddressLine2" onChange={(e) => this.updateCompany(e, 'addressLine2')} className="form-control" id="companyAddressLine2" placeholder="Address line 2" />
        </div>
      </div>,
      <div className="form-group row">
        <label htmlFor="companyAddressLine3" className="col-sm-2 col-form-label">Address line 2</label>
        <div className="col-sm-10">
          <input type="text" value={this.state.company.addressLine3} autoComplete="companyAddressLine3" onChange={(e) => this.updateCompany(e, 'addressLine3')} className="form-control" id="companyAddressLine3" placeholder="Address line 3" />
        </div>
      </div>,
      <input className="btn btn-primary" type="submit" value="Save" onClick={this.saveCompany} />,
    ];

    return (
      <CollapsiblePanel header={CompanyFormHeader} content={CompanyNameFormContent} />
    );
  }
}
