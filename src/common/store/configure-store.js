import { createStore, compose, applyMiddleware } from 'redux';


import createSagaMiddleware from 'redux-saga';

import reducer from '../modules';
import sagas from '../modules/sagas';

const configureStore = (initialState, clientMiddleares = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = clientMiddleares.concat(sagaMiddleware);

  const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(sagas);

  return store;
};


export default configureStore;
