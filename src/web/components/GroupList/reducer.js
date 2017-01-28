import * as constants from './constants';

/**
 * Manages GroupList state.
 * @method
 * @param  {Object} [groups={}] - A collection of group states.
 * @param  {Object} action - A redux action.
 * @return {Object} - Rendered group state.
 */
export default (groups = {}, action) => {
  switch (action.type) {

  /** Set all groups. */
  case constants.SET_GROUPS: return action.groups;

  /** Update a single group. */
  case constants.SET_GROUP: return {
    ...groups,
    [action.id]: action.group,
  };

  /** Update the state on a group. */
  case constants.SET_GROUP_STATE: return {
    ...groups,
    [action.group]: {
      ...groups[action.group],
      state: action.state,
    },
  };

  /** Do nothing. */
  default: return groups;
  }
};
