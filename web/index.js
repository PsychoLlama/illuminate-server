/* eslint-disable global-require */
import React from 'react';
import store from './state';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import GroupList from './components/GroupList';

const root = document.getElementById('root');

const app = <AppContainer>
  <Provider store={store}>
    <GroupList />
  </Provider>
</AppContainer>;

render(app, root);

// Webpack hot-reloading configuration.
if (module.hot) {
  module.hot.accept(['./components/GroupList', './state'], () => {
    const NextApp = require('./components/GroupList').default;
    const nextStore = require('./state').default;

    render(
      <AppContainer>
        <Provider store={nextStore}>
          <NextApp />
        </Provider>
      </AppContainer>,
      root
    );
  });
}
