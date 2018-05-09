import { createSelector } from 'reselect';

import { getMetaSelector } from '../selectors';

const getTestMeta = createSelector(
  getMetaSelector,
  ({ testMeta }) => testMeta
);

const getFeatureToggles = createSelector(
  getMetaSelector,
  ({ featureToggles }) => featureToggles
);

const getDownloadInvoice = createSelector(
  getMetaSelector,
  ({ downloadInvoice }) => downloadInvoice
);

const getTheme = createSelector(
  getMetaSelector,
  ({ theme }) => theme
);

module.exports = {
  getTestMeta,
  getFeatureToggles,
  getDownloadInvoice,
  getTheme,
};
