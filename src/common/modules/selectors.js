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

const getClientSelector = createSelector(
  getRootSelector,
  ({ client }) => client
);

module.exports = {
  getRootSelector,
  getMetaSelector,
  getInvoiceSelector,
  getClientSelector,
};
