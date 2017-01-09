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
    [action.name]: action.group,
  };

  /** Do nothing. */
  default: return groups;
  }
};
