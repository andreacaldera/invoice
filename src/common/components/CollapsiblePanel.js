import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';

import { getTheme } from '../modules/meta/selectors';

class CollapsiblePanel extends Component {
  static propTypes = {
    header: PropTypes.element.isRequired,
    content: PropTypes.element,
    theme: PropTypes.string.isRequired,
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
    const Container = styled.div`
      color: ${(props) => props.theme[this.props.theme]};
      margin-bottom: 10px;
    `;

    const theme = {
      main: 'mediumseagreen',
      acqua: 'blue',
    };

    const Header = styled.div`
      background-color: lightblue;
      margin-bottom: 10px;
      padding: 10px;
    `;

    const Content = styled.div`
      padding: 10px;
    `;

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Header onClick={this.togglePanelVisibility} role="presentation">
            {this.props.header}
          </Header>
          <Content className={this.state.panelVisible ? '' : 'sr-only'}>
            {this.props.content}
          </Content>
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToPros = (state) => ({
  theme: getTheme(state),
});

export default connect(mapStateToPros, null)(CollapsiblePanel);
