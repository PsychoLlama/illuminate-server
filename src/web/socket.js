/* eslint-disable global-require */
import Socket from 'socket.io-client';

import store from './state';
import { actions } from './components/GroupList';

let actionsCtx = actions;

const socket = Socket(location.origin);

socket.on('change:groups', (groups) => {
  store.dispatch(actionsCtx.setGroups(groups));
});

// Hot replace the GroupList actions.
if (module.hot) {
  module.hot.accept(['./components/GroupList'], () => {
    actionsCtx = require('./components/GroupList').actions;
  });
}

export default socket;
