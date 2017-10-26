import { combineReducers } from 'redux';

import { SET_INVOICE_NUMBER, ADD_INVOCE_ITEM, INVOICE_ADDED } from './constants';

const invoiceNumber = (state = '', action) => {
  switch (action.type) {
    case SET_INVOICE_NUMBER: return action.payload;
    default: return state;
  }
};

const invoiceItems = (state = [], action) => {
  switch (action.type) {
    case ADD_INVOCE_ITEM: return state.concat(action.payload);
    default: return state;
  }
};

const all = (state = [], action) => {
  switch (action.type) {
    case INVOICE_ADDED: return state.concat(action.invoice);
    default: return state;
  }
};

module.exports = combineReducers({
  all,
  company: (state = {}) => state,
  invoiceStyle: (state = {}) => state,
  activeInvoiceId: (state = {}) => state,
  invoiceNumber,
  invoiceItems,
});
