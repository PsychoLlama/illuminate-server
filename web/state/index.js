/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers } from 'redux';
import { reducer as groups } from '../components/GroupList';

export const reducer = combineReducers({
  lights: (lights = {}) => lights,
  groups,
});

const ReduxDevTools = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
let devTools;

if (ReduxDevTools instanceof Function) {
  devTools = ReduxDevTools();
}

const initialState = global.__INITIAL_APP_STATE__;
const store = createStore(reducer, initialState, devTools);

export default store;
