import { createStore, combineReducers } from 'redux';
import groups from '../Groups/reducer';

const reducers = {
  groups,
};

const reducer = combineReducers(reducers);

export default createStore(reducer);
