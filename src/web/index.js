/* eslint-disable global-require */
import { AppContainer } from 'react-hot-loader';
import Socket from 'socket.io-client';
import { render } from 'react-dom';
import React from 'react';

import App from './components/App';
import store from './state';

const socket = Socket(location.origin);

const root = document.getElementById('root');

const app = <AppContainer>
  <App store={store} socket={socket} />
</AppContainer>;

render(app, root);

// Webpack hot module replacement config.
if (module.hot) {
  module.hot.accept(['./components/App'], () => {
    const NextApp = require('./components/App').default;

    render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      root
    );
  });
}
