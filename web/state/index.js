import { createStore, combineReducers } from 'redux';
import { reducer as groups } from '../components/GroupList';

const reducers = {
  groups,
};

export const reducer = combineReducers(reducers);

export default createStore(reducer);
