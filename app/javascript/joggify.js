import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import AppRouter from './containers/AppRouter';
import configureStore from './store/configureStore';

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(AppRouter);

if (module.hot) {
  module.hot.accept('./containers/AppRouter', () => {
    const NextAppRouter = require('./containers/AppRouter').default; // eslint-disable-line
    render(NextAppRouter);
  });
}
