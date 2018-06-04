import { combineReducers } from 'redux';

module.exports = combineReducers({
  theme: (state = null) => state,
  featureToggles: (state = []) => state,
  downloadInvoice: (state = []) => state,
});
