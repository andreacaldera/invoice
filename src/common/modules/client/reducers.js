import { combineReducers } from 'redux';

module.exports = combineReducers({
  allClients: (state = {}) => state,
  selectedClientName: (state = {}) => state,
});
