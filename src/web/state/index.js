/* eslint-disable no-underscore-dangle, global-require */
import { createStore } from 'redux';
import reducer from './reducer';

const ReduxDevTools = global.__REDUX_DEVTOOLS_EXTENSION__;
let devTools;

if (ReduxDevTools instanceof Function) {
  devTools = ReduxDevTools();
}

const initialState = global.__INITIAL_APP_STATE__;
const store = createStore(reducer, initialState, devTools);

export default store;

// Hot-replace reducers.
if (module.hot) {
  module.hot.accept(['./reducer'], () => {
    const reducer = require('./reducer').default;
    store.replaceReducer(reducer);
  });
}
