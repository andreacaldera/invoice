import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

export default class ClientForm extends Component {
  static propTypes = {
    clients: PropTypes.shape().isRequired,
    selectedClient: PropTypes.shape(),
    selectClient: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    selectedClient: this.props.selectedClient,
    panelVisible: false,
  }

  updateClient(e, field) {
    e.preventDefault();
    this.setState({ selectedClient: Object.assign({}, this.state.selectedClient, { [field]: e.target.value }) });
  }

  togglePanelVisibility() {
    const panelVisible = !this.state.panelVisible;
    this.setState({ panelVisible });
  }

  selectClient(e) {
    e.preventDefault();
    const selectedClient = this.props.clients[e.target.value];
    this.setState({ selectedClient });
    this.props.selectClient(selectedClient);
  }

  render() {
    if (!this.state.selectedClient) {
      return (
        <p>Please add a client</p>
      );
    }

    const clientsDropdown = (
      <select onChange={this.selectClient}>
        {Object.keys(this.props.clients).map((clientName) => (<option selected={clientName === this.state.selectedClient.name} key={clientName} value={clientName}>{clientName}</option>))}
      </select>
    );
    return (
      <div className="collapsible-panel">
        <div className="collapsible-panel__header">
          <h3 className="mb-1 collapsible-panel__title">
            Client
          </h3>
          {clientsDropdown}
          <input className="btn btn-primary btn-sm float-right" type="button" value={this.state.panelVisible ? 'Cancel' : 'Edit'} onClick={this.togglePanelVisibility} />
        </div>
        <div className={`collapsible-panel__inner-panel ${this.state.panelVisible ? '' : 'sr-only'}`}>
          <div className="form-group row">
            <label htmlFor="clientName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.selectedClient.name} onChange={(e) => this.updateClient(e, 'name')} className="form-control" id="clientName" placeholder="Name" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine1" className="col-sm-2 col-form-label">Address line 1</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.selectedClient.addressLine1} onChange={(e) => this.updateClient(e, 'addressLine1')} className="form-control" id="clientAddressLine1" placeholder="Line 1" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine2" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.selectedClient.addressLine2} onChange={(e) => this.updateClient(e, 'addressLine2')} className="form-control" id="clientAddressLine2" placeholder="Address line 2" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine3" className="col-sm-2 col-form-label">Address line 3</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.selectedClient.addressLine3} onChange={(e) => this.updateClient(e, 'addressLine3')} className="form-control" id="clientAddressLine3" placeholder="Address line 3" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
