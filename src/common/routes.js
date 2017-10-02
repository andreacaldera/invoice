import App from './components/App';
import Home from './components/Home';
import About from './components/About';
import AddInvoice from './components/AddInvoice';
import Invoices from './components/Invoices';
import InvoicePreview from './components/InvoicePreview';

const routes = [
  { component: App,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/about', component: About },
      { path: '/invoices', component: Invoices },
      { path: '/add-invoice', component: AddInvoice },
      { path: '/invoice-preview', component: InvoicePreview },
    ],
  },
]; // TODO error page

export default routes;
