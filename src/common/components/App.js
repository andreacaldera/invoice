import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { renderRoutes } from 'react-router-config';

import TopBar from './TopBar';
import meta from '../modules/meta';

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
      <TopBar downloadInvoice={downloadInvoice} />
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
