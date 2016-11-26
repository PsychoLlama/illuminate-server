/* eslint-disable no-console, global-require*/
/**
 * Attempts to load the bridge configuration,
 * and prints help messages if the file is corrupted,
 * or if the server hasn't been set up yet.
 */

import chalk from 'chalk';

let config, filename;

try {

  /** Try to find the json. */
  filename = require.resolve('./config.json');

  /** Try to load the json. */
  config = require(filename);
} catch (error) {

  if (error.code === 'MODULE_NOT_FOUND') {

    /** The json doesn't exist. */
    console.log(
      chalk.red('\tBridge configuration not found.')
    );
    console.log(
      chalk.gray('\tRun this to get started:')
    );
    console.log(
      chalk.gray('\t$ npm run setup')
    );

  } else if (error instanceof SyntaxError) {

    /** The json couldn't be parsed. */
    console.log(
      chalk.red('\tBridge config file is corrupt.')
    );
    console.log(
      chalk.gray('\tEither...')
    );
    console.log(
      chalk.gray('\n\tManually inspect the file:')
    );
    console.log(
      chalk.gray(`\t${filename}`)
    );
    console.log(
      chalk.gray('\n\tOr generate a new one:')
    );
    console.log(
      chalk.gray('\t$ npm run setup')
    );

  } else {

    /** Unrecognized error. */
    throw error;
  }

  /** Just give up. */
  process.exit(1);
}

const { address, username } = config;
export const baseURL = `http://${address}/api/${username}`;

export default config;
