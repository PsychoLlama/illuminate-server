/* eslint-disable no-console*/
import { search, connect } from '../bridge-utils';
import { writeFile } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/** An array of callbacks. */
const stoppers = [];

const save = (auth) => {

  /** Where the keys are going. */
  const filename = join(__dirname, '../../keys.json');

  /** Turn the data into a string. */
  const string = JSON.stringify(auth, null, 2);

  /** Write the data. */
  writeFile(filename, string, (error) => {
    if (error) {
      const msg = chalk.red('\nSetup failed.\n');
      console.log(msg, error);
      process.exit(1);
      return;
    }

    const msg = chalk.green('\nConfigured successfully!');
    console.log(msg);

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
    const msg = chalk.magenta('Press the button on your bridge.\n');
    console.log(msg);
  }

  const msg = chalk.gray('New bridge discovered:');
  console.log(msg, bridge.hue_bridgeid);

  /** Get the bridge api url. */
  const url = `http://${bridge.address}/api`;

  const stop = connect(url, (auth) => {
    const msg = chalk.green('\nAuthorized.');
    const saving = chalk.gray('Saving keys...');

    console.log(msg);
    console.log(saving);

    /** Save the bridge address and username. */
    const data = {
      host: bridge.address,
      key: auth.username,
    };

    /** Save the file. */
    save(data);

    /** End the search. */
    call(stoppers);
  });

  stoppers.push(stop);

});

stoppers.push(stop);

/** Stop the search after 45s. */
const timeout = setTimeout(() => {
  const msg = chalk.red('\nTimeout reached, button not pressed.');
  console.log(msg);
  call(stoppers);
  process.exit();
}, 45 * 1000);

stoppers.push(() => clearTimeout(timeout));
