/* eslint-disable no-process-env */
const { address } = require('ip');

const HOST = address();
const PORT = Number(process.env.PORT) ||
  Number(process.argv[2]) ||
  8080;

module.exports = { PORT, HOST };
