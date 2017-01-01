import React, { Component, PropTypes } from 'react';
import Group from './Group';

/**
 * Shows a list of groups.
 * @class
 * @private
 */
class GroupList extends Component {
  componentWillMount () {
    const { store } = this.props;

    this.unsubscribe = store.subscribe(() => {
      const { groups } = store.getState();
      this.setState(groups);
    });
  }

  render () {
    const { store } = this.props;
    const state = store.getState();

    const groups = Object.entries(state.groups).map(
      ([key, data]) => <Group {...data} key={key} store={store} />
    );

    return <div>{groups}</div>;
  }

  componentWillUnmount () {
    this.unsubscribe();
  }
}

GroupList.propTypes = {
  store: PropTypes.object.isRequired,
};

export default GroupList;
