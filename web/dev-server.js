/* eslint-disable no-console */
const { PORT, HOST } = require('../env/development');
const path = require('path');

const webpack = require('webpack');
const config = require('../webpack.config');

const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const app = express();
const compiler = webpack(config);

app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
}));

app.use(hotMiddleware(compiler));

app.get('*', (req, res) => {
  const home = path.join(__dirname, '../static/index.html');
  res.sendFile(home);
});

app.listen(PORT, (err) => {
  console.log(err || `Listening as ${HOST}:${PORT}`);
});
