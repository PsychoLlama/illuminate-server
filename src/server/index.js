import diff, { applyChange } from 'deep-diff';
import { baseURL } from '../setup/result';
import poll from '../poll';
import Server from 'socket.io';

/**
 * Global, in-memory hue state.
 * @type {Object}
 */
export const state = {
  lights: {},
  groups: {},
};

/**
 * Create a callback that detects changes between two objects.
 * @param  {Object} state - A state to compare.
 * @param  {Function} callback - A function to call when data changes.
 * @return {Function} - Node-style callback that detects and
 * fires change events.
 */
export const detectChange = (state, callback) => (

  /**
   * Detects and emits change events.
   * @param  {Error} [err] - Any errors that happen.
   * @param  {Object} update - A new state to compare against the current.
   * @return {undefined}
   */
  (err, update) => {
    const change = diff(state, update);

    if (!err && change) {
      callback(change, update);
    }
  }
);

/**
 * Mutates the current state, recursively applying updates.
 * @param  {Object} state - The current state to mutate.
 * @param  {Object} update - A newer state.
 * @param  {Array} changes - A list of changes between them.
 * @return {Array} - The list of changes.
 */
export const mergeChanges = (state, update, changes) => {
  changes.forEach((change) => {
    applyChange(state, update, change);
  });

  return changes;
};

/**
 * Creates a callback that updates local state and broadcasts changes.
 * @param  {EventEmitter[]} emitters - A list of emitters to call
 * (made for socket.io servers).
 * @param  {String} type - The change type to emit on (e.g., "lights").
 * @param  {Object} state - The state object to mutate.
 * @return {undefined}
 */
export const handleChange = (emitters, type, state) => (

  /**
   * Merges updates into local state and broadcasts them.
   * @param  {Array} changes - A list of changes.
   * @param  {Object} update - The complete new state.
   * @return {undefined}
   */
  (changes, update) => {

    /** Update the local state. */
    mergeChanges(state, update, changes);

    /** Broadcast the change event. */
    emitters.forEach((emitter) => {
      emitter.emit(`change:${type}`, changes);
    });
  }
);

/**
 * Routes mapped to emitters that should be fired on change.
 * @type {Object}
 */
const listeners = {
  lights: [],
  groups: [],
};

poll({
  endpoint: `${baseURL}/lights`,
  interval: 500,
  callback: detectChange(
    state.lights,
    handleChange(
      listeners.lights,
      'lights',
      state.lights
    )
  ),
});

poll({
  endpoint: `${baseURL}/groups`,
  interval: 500,
  callback: detectChange(
    state.groups,
    handleChange(
      listeners.groups,
      'groups',
      state.groups
    )
  ),
});

/**
 * Begins a websocket server, emitting real-time bridge updates.
 * @param  {Number|Server} config - Passed to socket.io as the server.
 * @return {undefined}
 */
export default (config) => {
  const server = new Server(config);

  /** Subscribe to bridge changes. */
  listeners.lights.push(server);
  listeners.groups.push(server);
};
