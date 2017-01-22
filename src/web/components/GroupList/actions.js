import { constants } from './index';

/**
 * Overwrites all group data.
 * @param  {Object} groups - Data to replace groups with.
 * @return {Object} - Redux action.
 */
export const setGroups = (groups) => ({
  type: constants.SET_GROUPS,
  groups,
});

/**
 * Overwrites a single group.
 * @param  {String|Number} id - The group's identifier.
 * @param  {Object} group - The group replacement.
 * @return {Object} - Redux action.
 */
export const setGroup = (id, group) => ({
  type: constants.SET_GROUP,
  group,
  id,
});
