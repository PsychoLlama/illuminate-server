const noop = () => {};

/**
 * Mocks out a redux store interface.
 * @private
 * @param  {Object} state - The current state.
 * @return {Object} - An interface similar to a redux store.
 */
export const createStore = (state) => ({
  getState: () => state,
  subscribe: noop,
  dispatch: noop,
  setState: (update) => (state = update),
});
