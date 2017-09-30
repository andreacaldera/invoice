import { createSelector } from 'reselect';

import { getClientSelector } from '../selectors';

const getAll = createSelector(
  getClientSelector,
  ({ all }) => all
);

const getSelected = createSelector(
  getAll,
  (all) => all[0], // TODO
);

module.exports = {
  getAll,
  getSelected,
};
