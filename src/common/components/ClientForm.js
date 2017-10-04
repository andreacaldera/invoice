import React, { Component } from 'react';
import autobind from 'react-autobind';
import PropTypes from 'prop-types';

export default class ClientForm extends Component {
  static propTypes = {
    client: PropTypes.shape().isRequired,
    saveClient: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    client: this.props.client,
    panelVisible: false,
  }

  updateClient(e, field) {
    e.preventDefault();
    this.setState({ client: Object.assign({}, this.state.client, { [field]: e.target.value }) });
  }

  togglePanelVisibility() {
    const panelVisible = !this.state.panelVisible;
    this.setState({ panelVisible });
  }

  saveClient(e) {
    e.preventDefault();
    const { client } = this.state;
    this.props.saveClient({ client });
    this.setState({ panelVisible: false });
  }

  render() {
    return (
      <div className="client-panel p-3 m-3">
        <h3 className="mb-1 subpanel__title">Client</h3>
        <input className="btn btn-secondary btn-sm" type="button" value={this.state.panelVisible ? 'Cancel' : 'Edit'} onClick={this.togglePanelVisibility} />
        <div className={this.state.panelVisible ? '' : 'sr-only'}>
          <div className="form-group row">
            <label htmlFor="clientName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.client.name} onChange={(e) => this.updateClient(e, 'name')} className="form-control" id="clientName" placeholder="Name" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine1" className="col-sm-2 col-form-label">Address line 1</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.client.addressLine1} onChange={(e) => this.updateClient(e, 'addressLine1')} className="form-control" id="clientAddressLine1" placeholder="Line 1" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine2" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.client.addressLine2} onChange={(e) => this.updateClient(e, 'addressLine2')} className="form-control" id="clientAddressLine2" placeholder="Address line 2" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="clientAddressLine3" className="col-sm-2 col-form-label">Address line 2</label>
            <div className="col-sm-10">
              <input type="text" value={this.state.client.addressLine3} onChange={(e) => this.updateClient(e, 'addressLine3')} className="form-control" id="clientAddressLine3" placeholder="Address line 3" />
            </div>
          </div>
          <input className="btn btn-primary" type="submit" value="Save" onClick={this.saveClient} />
        </div>
      </div>
    );
  }
}
