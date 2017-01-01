import React, { PropTypes } from 'react';

/**
 * Shows a group of lights.
 * @class
 * @private
 */
const Group = ({ name, onToggle }) => (
  <div onClick={onToggle}>
    <h1>{name}</h1>
  </div>
);

Group.propTypes = {
  name: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired,
  lights: PropTypes.array.isRequired,
  onToggle: PropTypes.func,
};

export default Group;
