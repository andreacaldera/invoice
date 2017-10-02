import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { renderRoutes } from 'react-router-config';

import configureStore from '../common/store/configure-store';

import routes from '../common/routes';

const store = configureStore(window.__initialState__, true);

const AppRouter = () => (
  <Provider store={store}>
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  </Provider>
);

render(<AppRouter />, document.querySelector('#app'));
