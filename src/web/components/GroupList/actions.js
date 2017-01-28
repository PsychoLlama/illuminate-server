import { promisify } from 'bluebird';

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

/**
 * Updates the state on a group.
 * @method setGroupState
 * @param  {String|Number} group - Group ID.
 * @param  {Object} state - Updated state.
 * @return {Object} - A redux action.
 */
export const setGroupState = (group, state) => ({
  type: constants.SET_GROUP_STATE,
  group,
  state,
});

const createRequestId = () => (
  Math.random().toString(36).slice(2)
);

export const sendGroupState = ({
  socket,
  group,
  state,
}) => () => {
  const requestId = createRequestId();

  const promiseFromEvent = promisify(socket.once).bind(socket);
  const promise = promiseFromEvent(requestId);

  socket.emit('update:groups', { requestId, group, state });

  return promise;
};
