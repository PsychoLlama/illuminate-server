/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers } from 'redux';
import { reducer as groups } from '../components/GroupList';

export const reducer = combineReducers({
  lights: (lights = {}) => lights,
  groups,
});

const initialState = global.__INITIAL_APP_STATE__;
const store = createStore(reducer, initialState);

export default store;
