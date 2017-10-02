import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { renderRoutes } from 'react-router-config';

import TopBarComponent from './TopBar';
import meta from '../modules/meta';

const TopBar = React.createFactory(TopBarComponent);

const App = ({ downloadInvoice, route }) => {
  const mainContent = (
    <div className="container">
      <div className={`invoice-container ${downloadInvoice ? '' : 'invoice-container-margin'}`}>
        {renderRoutes(route.routes)}
      </div>
    </div>
  );
  if (downloadInvoice) {
    return mainContent;
  }

  return (
    <div>
      {TopBar()}
      {mainContent}
    </div>
  );
};

App.propTypes = {
  route: PropTypes.shape().isRequired,
  downloadInvoice: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  downloadInvoice: meta.getDownloadInvoice(state),
});

export default connect(mapStateToProps, null)(App);
