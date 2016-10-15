import axios from 'axios';

/**
 * Polls an endpoint at an interval.
 * @param  {String} endpoint - The URL to poll.
 * @param  {Number} interval - An interval to poll at in milliseconds.
 * @param  {Function} fn - A node-style callback, takes errors
 * and response data.
 * @return {Function} - Stops polling the endpoint.
 */
const poll = (endpoint, interval, fn) => {

  let timeout, ended = false;

  /**
   * Send a request to the endpoint, invoking the callback
   * with the data or any errors.
   * @return {Promise} - Resolves when the request completes.
   */
  const request = async () => {
    try {

      /** Send the request. */
      const { data } = await axios.get(endpoint);

      /** Quit if the request was cancelled. */
      if (ended) {
        return;
      }

      /** Pass the data, node callback style. */
      fn(null, data);
    } catch (error) {

      /** Report errors. */
      fn(error, null);
    }
  };

  /**
   * Starts a request, and schedules the next when it finishes.
   * @return {undefined}
   */
  const loop = async () => {

    /** Send a new request. */
    await request();

    /** Schedule the next one. */
    timeout = setTimeout(loop, interval);
  };

  /** Kick off the polling loop. */
  loop();

  /**
   * Stops the polling loop.
   * @return {undefined}
   */
  const stop = () => {
    ended = true;
    clearTimeout(timeout);
  };

  return stop;
};

export default poll;
