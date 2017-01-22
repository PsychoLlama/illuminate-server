/* eslint-disable no-console */
import { Server } from 'http';

import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import express from 'express';

import { PORT, HOST } from '../../env/development';
import config from '../../webpack.config';
import Luminary from '../index';
import appRouter from './routes';

const app = express();
const server = Server(app);

Luminary(server);

const compiler = webpack(config);

app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
}));

app.use(hotMiddleware(compiler));

app.use(appRouter);

server.listen(PORT, (err) => {
  const msg = `Listening as ${HOST}:${PORT}`;
  console.log(err || msg);
});
