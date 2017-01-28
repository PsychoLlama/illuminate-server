import React, { PropTypes } from 'react';

const Group = ({ name, onClick }) => <div>
  <h2 className='title' onClick={onClick}>{name}</h2>
</div>;

Group.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Group;
