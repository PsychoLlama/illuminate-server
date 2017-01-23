import Emitter from 'events';

import Server from 'socket.io';
import axios from 'axios';

import { baseURL } from '../setup/result';
import db from '../database';
import poll from '../poll';
import {
  createChangeDetector,
  applyUpdateTo,
  getColorFromState,
} from './util';

/**
 * Global, in-memory hue state. Mutates over time.
 * @type {Object}
 */
export const state = {};
export const events = new Emitter();

/** Add changes to the database. */
events.on('update', async (type, changes) => {
  if (type !== 'lights') {
    return;
  }

  // Query for pushing light states into history.
  const insert = `
  INSERT INTO history (light, color, time)
  VALUES ($1::text, $2::text, NOW());
  `;

  changes.forEach((change) => {

    // Get the light which changed.
    const [lightIndex] = change.path;
    const light = state.lights[lightIndex];

    // Get its unique id and current color.
    const { uniqueid } = light;
    const color = getColorFromState(light.state);

    db.query(insert, [uniqueid, color]);

  });

});

events.setMaxListeners(Infinity);

(async () => {

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
    interval: 500,
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

  const broadcast = (type, change) => {
    server.emit(`change:${type}`, change);
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
