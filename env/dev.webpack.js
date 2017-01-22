const path = require('path');

const merge = require('webpack-merge');
const webpack = require('webpack');

const base = require('./base.webpack');

module.exports = merge(base, {
  devtool: 'cheap-module-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.join(__dirname, '../src/web/index'),
  ],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
