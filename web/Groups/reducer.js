/**
 * Handles group-related operations on data.
 * @param  {Object} [state={}] - The current group state.
 * @param  {Object} action - Supports:
 * - SET_GROUPS: Replaces the current groups.
 * @return {Object} - The rendered group state.
 */
export default (state = {}, action) => {
  const { type, groups } = action;

  return type === 'SET_GROUPS' ? groups : state;
};
