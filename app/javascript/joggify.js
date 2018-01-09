import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import RootContainer from './containers/RootContainer';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
}

render(RootContainer);

if (module.hot) {
  module.hot.accept('./containers/RootContainer.js', () => {
    const NextRootContainer = require('./containers/RootContainer').default;
    render(NextRootContainer);
  });
}
