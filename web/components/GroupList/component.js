import React, { Component, PropTypes } from 'react';
import Group from '../Group';

const toGroupElement = ([name, data]) => <Group
  {...data}
  key={name}
/>;

/**
 * Renders and updates a list of groups.
 * @class
 */
export default class GroupList extends Component {
  static propTypes = {
    store: PropTypes.shape({
      dispatch: PropTypes.func,
      getState: PropTypes.func,
    }).isRequired,
  }

  constructor ({ store }) {
    super();

    const { groups } = store.getState();

    this.state = { groups };
  }

  componentWillMount () {
    const { store } = this.props;

    this.unsubscribe = store.subscribe(() => {
      const { groups } = store.getState();
      this.setState({ groups });
    });
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  renderGroups (groups) {
    const pairs = Object.entries(groups);
    return pairs.map(toGroupElement);
  }

  render () {
    return <div>
      {this.renderGroups(this.state.groups)}
    </div>;
  }
}
