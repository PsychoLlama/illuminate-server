import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';

import GroupList from '../GroupList';

/**
 * Creates a root-level app component.
 * @param  {Object} props.store - A redux store.
 * @return {Component} - The main app component.
 */
const App = ({ store }) => (
  <Provider store={store}>
    <GroupList />
  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default App;
