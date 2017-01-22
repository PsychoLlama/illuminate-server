const { join } = require('path');

const merge = require('webpack-merge');
const webpack = require('webpack');

const base = require('./base.webpack');

module.exports = merge(base, {
  entry: join(__dirname, '../src/web/index'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {

        // Enables React production mode.
        NODE_ENV: JSON.stringify('production'),

      },
    }),

    new webpack.optimize.UglifyJsPlugin(),
  ],
});
