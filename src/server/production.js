/* eslint-disable no-console */
import { Server } from 'http';

import express from 'express';

import { PORT, HOST } from '../../env/prod.vars';
import Luminary from '../index';
import routes from './routes';

const app = express();
const server = new Server(app);
Luminary(server);

app.use(routes);

server.listen(PORT, HOST, (err) => {
  const msg = `Server listening as http://${HOST}:${PORT}`;
  console.log(err || msg);
});
