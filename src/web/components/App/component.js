import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';

import GroupList from '../GroupList';

/**
 * Creates a root-level app component.
 * @param  {Object} props.store - A redux store.
 * @return {Component} - The main app component.
 */
const App = ({ store, socket }) => (
  <Provider store={store}>
    <GroupList socket={socket} />
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
  socket: PropTypes.object,
};

export default App;
