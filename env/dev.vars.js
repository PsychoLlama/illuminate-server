/* eslint-disable no-process-env */
const { address } = require('ip');

module.exports = {
  PORT: 8080,
  HOST: address(),
};
