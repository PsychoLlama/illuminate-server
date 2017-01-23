import diff, { applyChange } from 'deep-diff';
import tinycolor from 'tinycolor2';

/**
 * Create a callback that detects changes between two objects.
 * @param  {Object} state - A state to compare.
 * @param  {Function} callback - A function to call when data changes.
 * @return {Function} - Node-style callback that detects and
 * fires change events.
 */
export const createChangeDetector = (state, callback) => (

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
 * Applies a hue update to a field on server state.
 * @param  {Object} state - A state object to mutate.
 * @param  {EventEmitter} events - An emitter to pipe updates through.
 * @return {Function} - Accepts a field to keep in sync.
 */
export const applyUpdateTo =
  (state, events) =>
  (field) =>
  (changes, value) => {

    // Mutate current state.
    mergeChanges(state[field], value, changes);

    // Broadcast the change.
    events.emit('update', field, changes);

  };

export const getHuePercentage = (hue) => hue / 0xffff;
export const getSatPercentage = (sat) => sat / 254;
export const getBriPercentage = (bri) => bri / 254;

/**
 * Turns a hue HSB state into a hex code.
 * @param  {Object} state - Light state.
 * @return {String} - A hex code without the hash symbol.
 */
export const getColorFromState = ({ on, hue, sat, bri }) => {
  if (on === false) {
    return '000000';
  }

  const ratio = {

    /* eslint-disable id-length */
    h: getHuePercentage(hue),
    s: getSatPercentage(sat),
    l: getBriPercentage(bri),
    /* eslint-enable id-length */

  };

  // Parse the HSL ratio.
  const color = tinycolor.fromRatio(ratio);

  // Turn it into a six-digit hex color code.
  const hex = color.toString('hex6');

  // Remove the hash symbol (it's implied).
  const hexWithoutHashSign = hex.slice(1);

  return hexWithoutHashSign;

};
