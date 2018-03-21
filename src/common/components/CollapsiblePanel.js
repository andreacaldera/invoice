import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';

export default class CollapsiblePanel extends Component {
  static propTypes = {
    header: PropTypes.element.isRequired,
    content: PropTypes.element,
  }

  constructor(...args) {
    super(...args);
    autobind(this);
  }

  state = {
    panelVisible: false,
  }


  togglePanelVisibility() {
    const panelVisible = !this.state.panelVisible;
    this.setState({ panelVisible });
  }

  render() {
    return [
      <div className="collapsible-panel">
        <div className="collapsible-panel__header" onClick={this.togglePanelVisibility} role="presentation">
          {this.props.header}
        </div>
        <div className={`collapsible-panel__inner-panel ${this.state.panelVisible ? '' : 'sr-only'}`}>
          {this.props.content}
        </div>
      </div>,
    ];
  }
}
