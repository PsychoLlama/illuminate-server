import { join } from 'path';

import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Router } from 'express';
import React from 'react';

import App from '../web/components/App';
import { reducer } from '../web/state';
import { state } from '../index';

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
      JSON.stringify(state)
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
  const store = createStore(reducer, state);
  const app = renderToString(<App store={store} />);
  const homepage = renderFullPage(app);

  res.status(200).type('html').end(homepage);
});

export default router;
