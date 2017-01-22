/* eslint-disable global-require */
import React from 'react';
import store from './state';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const root = document.getElementById('root');

const app = <AppContainer>
  <App store={store} />
</AppContainer>;

render(app, root);

// Webpack hot module replacement config.
if (module.hot) {
  module.hot.accept(['./components/App', './state'], () => {
    const NextApp = require('./components/App').default;
    const nextStore = require('./state').default;

    render(
      <AppContainer>
        <NextApp store={nextStore} />
      </AppContainer>,
      root
    );
  });
}
