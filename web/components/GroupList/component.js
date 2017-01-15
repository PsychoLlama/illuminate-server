import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Group from '../Group';

// Turns a key-value pair into a <Group> component.
const toGroupElement = ([name, data]) => (
  <Group {...data} key={name} />
);

/**
 * Renders and updates a list of groups.
 * @class
 */
export const GroupList = ({ groups }) => {

  const groupComponents = Object
    .entries(groups)
    .map(toGroupElement);

  return <div>{groupComponents}</div>;
};

GroupList.propTypes = {
  groups: PropTypes.object.isRequired,
};

/** Bind <GroupList> to redux. */
export default connect(
  ({ groups }) => ({ groups })
)(GroupList);
