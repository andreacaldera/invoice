import { createSelector } from 'reselect';
import { NAMESPACE } from './constants';

const getRootSelector = (state) => state[NAMESPACE];

const getMetaSelector = createSelector(
  getRootSelector,
  ({ meta }) => meta
);

const getInvoiceSelector = createSelector(
  getRootSelector,
  ({ invoice }) => invoice
);

module.exports = {
  getRootSelector,
  getMetaSelector,
  getInvoiceSelector,
};
