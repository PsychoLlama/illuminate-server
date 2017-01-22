const path = require('path');

const webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, '../'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: path.join(__dirname, '../node_modules'),
    }, {
      test: /\.s(c|a)ss$/,
      loaders: ['style', 'css', 'sass'],
      exclude: path.join(__dirname, '../node_modules'),
    }],
  },

  resolve: {
    extensions: [
      '',
      '.js',
      '.scss',
    ],
  },
};
