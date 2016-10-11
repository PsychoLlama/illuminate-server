export Search from 'hue-bridge-discovery';
import Search, {
  EVENT_HUE_DISCOVERED as found,
} from 'hue-bridge-discovery';
import axios from 'axios';
import { hostname } from 'os';

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
 * @param  {String}   url - The API endpoint to poll.
 * @param  {Function} fn  - Called when the bridge accepts.
 * @return {Function} - Stops polling.
 */
export const connect = (url, fn) => {
  if (!url) {
    throw new Error(
      `'connect' expects a URL, was given "${url}".`
    );
  }

  /** Get the device name. */
  const device = hostname();
  let ended = false;

  /**
   * Post to the API.
   * @return {Promise} - An axios.post promise.
   */
  const post = () => (
    axios.post(url, {
      devicetype: `illumination#${device}`,
    })
  );

  /**
   * Send post requests until successful,
   * or stop is called.
   * @return {Promise} - An axios.post promise.
   */
  const poll = () => (
    post().then(({ data }) => {
      const [result] = data;

      /** Don't proceed if stop was called. */
      if (ended) {
        return undefined;
      }

      /** See if hue responded with success. */
      if (result.success) {
        fn(result.success);
        return undefined;
      }

      /** Continue polling. */
      return poll();

      /** Continue polling on failures. */
    }).catch(poll)
  );

  // Kick off the polling loop.
  poll();

  /**
   * Ends the loop if called.
   * @return {Boolean} - Just returns true.
   */
  const stop = () => (ended = true);

  return stop;
};

/* STOP SCROLLING! */
