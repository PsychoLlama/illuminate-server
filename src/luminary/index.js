import Emitter from 'events';

import Server from 'socket.io';
import axios from 'axios';

import { baseURL } from '../setup/result';
import poll from '../poll';
import {
  createChangeDetector,
  applyUpdateTo,
} from './util';

/**
 * Global, in-memory hue state. Mutates over time.
 * @type {Object}
 */
export const state = {};

/**
 * Emits as polling-related updates occur.
 * @type {EventEmitter}
 */
export const events = new Emitter();
events.setMaxListeners(Infinity);

/**
 * Resolves when the initial state has loaded.
 * @type {Promise}
 */
export const stateLoaded = (async () => {

  /** Provide the initial state. */
  const { data } = await axios.get(baseURL);
  Object.assign(state, data);

  const updateField = applyUpdateTo(state, events);
  const handleUpdatesForField = (field) => createChangeDetector(
    state[field],
    updateField(field)
  );

  /** Poll for light updates. */
  poll({
    endpoint: `${baseURL}/lights`,
    interval: 500,
    callback: handleUpdatesForField('lights'),
  });

  /** Poll for group updates. */
  poll({
    endpoint: `${baseURL}/groups`,
    interval: 2500,
    callback: handleUpdatesForField('groups'),
  });

})();

/**
 * Begins a websocket server, emitting real-time bridge updates.
 * @param  {Number|Server} config - Passed to socket.io as the server.
 * @return {Object} - Server interfaces for greater control.
 */
export default (config) => {
  const server = new Server(config);

  const broadcast = (type) => {
    const value = state[type];
    server.emit(`change:${type}`, value);
  };

  /** Forward bridge changes to clients. */
  events.on('update', broadcast);

  return {

    /**
     * Socket.io server.
     * @type {io.Server}
     */
    io: server,

    /**
     * Stops listening for bridge changes.
     * @method dispose
     * @return {undefined}
     */
    dispose: () => {
      events.removeListener('update', broadcast);
    },

  };
};
