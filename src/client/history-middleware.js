import history from './history';

import { INVOICE_ADDED } from '../common/modules/invoice/constants';

function historyMiddleware(/* { getState } */) {
  return (next) => (action) => {
    next(action);
    switch (action.type) {
      case INVOICE_ADDED:
        history.push('/invoices');
        break;
      default:
    }
  };
}

export default historyMiddleware;
