import { createStore, compose, applyMiddleware } from 'redux';

import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducer from '../modules';
import sagas from '../modules/sagas';

const configureStore = (initialState, useLogger) => {
  const sagaMiddleware = createSagaMiddleware();

  const middleware = useLogger ?
    applyMiddleware(
      sagaMiddleware,
      createLogger
    ) :
    applyMiddleware(
      sagaMiddleware,
    );

  const store = createStore(
    reducer,
    initialState,
    compose(middleware)
  );

  sagaMiddleware.run(sagas);

  return store;
};


export default configureStore;
