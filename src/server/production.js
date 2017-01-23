/* eslint-disable no-console */
import { Server } from 'http';

import express from 'express';

import Luminary, { events, state, stateLoaded } from '../index';
import { getColorFromState } from '../luminary/util';
import { PORT, HOST } from '../../env/prod.vars';
import db, { initDatabase } from '../database';
import routes from './routes';

const app = express();
const server = new Server(app);
Luminary(server);

app.use(routes);

// Query for pushing light states into history.
const insertLightState = `
INSERT INTO history (light, color, time)
VALUES ($1::text, $2::text, NOW());
`;

const saveToDatabase = () => async (type, changes) => {
  if (type !== 'lights') {
    return;
  }

  changes.forEach((change) => {

    // Get the light which changed.
    const [lightIndex] = change.path;
    const light = state.lights[lightIndex];

    // Get its unique id and current color.
    const { uniqueid } = light;
    const color = getColorFromState(light.state);

    // Write the data.
    db.query(insertLightState, [uniqueid, color]);

  });

};

(async () => {

  // Persist state updates.
  events.on('update', saveToDatabase);

  // Make sure the tables have been created.
  await initDatabase();

  // Wait for initial state.
  await stateLoaded;

  // Start the server!
  server.listen(PORT, HOST, (err) => {
    const msg = `Server listening as http://${HOST}:${PORT}`;
    console.log(err || msg);
  });

})();
