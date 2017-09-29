import { createSelector } from 'reselect';

import { getInvoiceSelector } from '../selectors';

const getAll = createSelector(
  getInvoiceSelector,
  ({ all }) => all
);

const getActiveInvoiceId = createSelector(
  getInvoiceSelector,
  ({ activeInvoiceId }) => activeInvoiceId
);

const getActiveInvoice = createSelector(
  [getAll, getActiveInvoiceId],
  (all, activeInvoiceId) => all.find(({ invoiceId }) => invoiceId === activeInvoiceId)
);

const getCompany = createSelector(
  getInvoiceSelector,
  ({ company }) => company
);

const getClient = createSelector(
  getInvoiceSelector,
  ({ client }) => client
);

const getInvoiceStyle = createSelector(
  getInvoiceSelector,
  ({ invoiceStyle }) => invoiceStyle
);

const getInvoice = createSelector(
  [getClient, getCompany],
  (client, company) => ({ client, company })
);

module.exports = {
  getAll,
  getActiveInvoice,
  getCompany,
  getInvoice,
  getClient,
  getInvoiceStyle,
};
