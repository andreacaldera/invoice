import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import About from './components/About';
import AddInvoice from './components/AddInvoice';
import Invoices from './components/Invoices';
import InvoicePreview from './components/InvoicePreview';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="about" component={About} />
    <Route path="invoices" component={Invoices} />
    <Route path="add-invoice" component={AddInvoice} />
    <Route path="invoice-preview/*" component={InvoicePreview} />
  </Route>
); // TODO error page

export default routes;
