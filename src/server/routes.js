import { join } from 'path';

import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Router } from 'express';
import React from 'react';

import reducer from '../web/state/reducer';
import App from '../web/components/App';
import { state } from '../index';

const getBrowserStateSubset = ({ lights, groups }) => ({
  lights,
  groups,
});

const renderFullPage = (app) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Luminary | IoT Dashboard</title>
</head>
<body>

  <!-- Application mounts here -->
  <div id="root">${app}</div>

  <script>
    /* Preloaded application state. */
    window.__INITIAL_APP_STATE__ = ${
      JSON.stringify(getBrowserStateSubset(state))
    }
  </script>

  <script src="/bundle.js" async></script>

</body>
</html>
`;

const router = Router();

const bundlePath = join(__dirname, '../../bundle.js');
router.get('/bundle.js', (req, res) => res.sendFile(bundlePath));

router.get('/*', (req, res) => {
  const store = createStore(reducer, getBrowserStateSubset(state));
  const app = renderToString(<App store={store} />);
  const homepage = renderFullPage(app);

  res.status(200).type('html').end(homepage);
});

export default router;
