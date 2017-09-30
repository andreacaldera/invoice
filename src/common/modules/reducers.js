import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import meta from './meta';
import invoice from './invoice';
import client from './client';

import { NAMESPACE } from './constants';

const rootReducer = combineReducers({
  meta,
  invoice,
  client,
});

module.exports = combineReducers({ routing: routerReducer, [NAMESPACE]: rootReducer });
