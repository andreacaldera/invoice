import { createSelector } from 'reselect';

import { getClientSelector } from '../selectors';

const getAllClients = createSelector(
  getClientSelector,
  ({ allClients }) => allClients
);

const getSelectedClientName = createSelector(
  getClientSelector,
  ({ selectedClientName }) => selectedClientName
);

const getSelectedClient = createSelector(
  [getAllClients, getSelectedClientName],
  (allClients, selectedClientName) => console.log(111, allClients, selectedClientName) || allClients[selectedClientName],
);

module.exports = {
  getAllClients,
  getSelectedClientName,
  getSelectedClient,
};
