/* eslint-disable no-underscore-dangle, global-require */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const ReduxDevTools = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
let devTools;

if (ReduxDevTools instanceof Function) {
  devTools = ReduxDevTools();
}

const initialState = global.__INITIAL_APP_STATE__;

const store = createStore(
  reducer,
  initialState,
  compose(applyMiddleware(thunk), devTools)
);

export default store;

// Hot-replace reducers.
if (module.hot) {
  module.hot.accept(['./reducer'], () => {
    const reducer = require('./reducer').default;
    store.replaceReducer(reducer);
  });
}
