import { combineReducers } from 'redux';
import { reducer as groups } from '../components/GroupList';

// Root reducer.
export default combineReducers({
  lights: (lights = {}) => lights,
  groups,
});
