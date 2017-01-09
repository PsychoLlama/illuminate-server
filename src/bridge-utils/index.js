export Search from 'hue-bridge-discovery';
import Search, {
  EVENT_HUE_DISCOVERED as found,
} from 'hue-bridge-discovery';
import { hostname } from 'os';
import poll from '../poll';

/**
 * Initiate a search for a hue bridge.
 * @param  {Function} fn - Called as bridges are found.
 * @return {Function} - Stops the search when called.
 */
export const search = (fn) => {

  /** Create a new search. */
  const search = new Search();

  /** Listen for discoveries. */
  search.on(found, fn);

  /** Begin the search. */
  search.start();

  /**
   * Ends the search.
   * @return {undefined}
   */
  return () => {

    // Unsubscribe.
    search.off(found, fn);

    // Stop the search.
    search.stop();
  };

};

/**
 * Poll a bridge for access until the button has been
 * pressed, or stop is called.
 * @param  {String} endpoint - The API endpoint to poll.
 * @param  {Function} fn - Called when the bridge accepts.
 * @return {Function} - Stops polling.
 */
export const connect = (endpoint, fn) => {
  if (!endpoint) {
    throw new Error(
      `'connect' expects a URL, was given "${endpoint}".`
    );
  }

  /** Get the device name. */
  const device = hostname();

  const stop = poll({
    endpoint,
    method: 'post',
    data: { devicetype: `luminary#${device}` },

    callback (err, response) {

      if (err || !response) {
        return;
      }

      const result = response[0] || {};

      if (result.success) {
        fn(result.success);
        stop();
      }

    },
  });

  return stop;
};

/* STOP SCROLLING! */
