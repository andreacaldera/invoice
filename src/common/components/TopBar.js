import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from 'react-router-dom/Link';

import metaModule from '../modules/meta';

const TopMenu = ({ downloadInvoice }) => (
  <nav className={`navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top ${downloadInvoice ? 'sr-only' : ''}`}>
    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="navbar-brand" to="/">Invoice</div>

    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <Link className="nav-link" to="/" href="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/add-invoice" href="/add-invoice">Add invoice</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/invoices" href="/invoices">Invoices</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about" href="/about">About</Link>
        </li>
      </ul>
    </div>
  </nav>
);

const mapStateToProps = (state) => ({
  downloadInvoice: metaModule.getDownloadInvoice(state),
});

TopMenu.propTypes = {
  downloadInvoice: PropTypes.bool.isRequired,
};


export default connect(mapStateToProps, null)(TopMenu);
