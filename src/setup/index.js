/* eslint-disable no-console*/
import { search, connect } from '../bridge-utils';
import { writeFile } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/** An array of callbacks. */
const stoppers = [];

const save = (auth) => {

  /** Where the keys are going. */
  const filename = join(__dirname, 'config.json');

  /** Turn the data into a string. */
  const string = JSON.stringify(auth, null, 2);

  /** Write the data. */
  writeFile(filename, string, (error) => {
    if (error) {
      console.log(
        chalk.red('\n\tSetup failed.\n'),
        error
      );
      process.exit(1);
      return;
    }

    console.log(
      chalk.green('\n\tConfigured successfully!\n')
    );

    process.exit();
  });
};

/**
 * Calls all the `stop` callbacks.
 * @param {Array} stoppers - An array of callbacks.
 * @return {Array} - A mapped array of return values.
 */
const call = (stoppers) => stoppers.map((fn) => fn());

let shown = false;

/** Start the bridge search. */
const stop = search((bridge) => {

  if (!shown) {
    shown = true;
    console.log(
      chalk.magenta('\tPress the button on your bridge.\n')
    );
  }

  console.log(
    chalk.gray('\tNew bridge discovered:'),
    bridge.hue_bridgeid
  );

  /** Get the bridge api url. */
  const url = `http://${bridge.address}/api`;

  const stop = connect(url, (granted) => {

    console.log(
      chalk.green('\n\tAuthorized.')
    );
    console.log(
      chalk.gray('\tSaving configuration...')
    );

    /** Save the bridge address and username. */
    const config = {
      address: bridge.address,
      username: granted.username,
    };

    /** Save the file. */
    save(config);

    /** End the search. */
    call(stoppers);
  });

  stoppers.push(stop);

});

stoppers.push(stop);

/** Stop the search after 45s. */
const timeout = setTimeout(() => {
  console.log(
    chalk.red('\nTimeout reached, button not pressed.')
  );
  call(stoppers);
  process.exit();
}, 45 * 1000);

stoppers.push(() => clearTimeout(timeout));
