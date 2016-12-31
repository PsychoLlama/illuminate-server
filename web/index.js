/* eslint-disable global-require */
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import Root from './components/Root';

const root = document.getElementById('root');

const app = <AppContainer>
  <Root />
</AppContainer>;

render(app, root);

// Webpack hot-reloading configuration.
if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextApp = require('./components/Root').default;
    render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      root
    );
  });
}
