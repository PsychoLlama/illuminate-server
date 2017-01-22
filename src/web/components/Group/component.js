import React, { PropTypes } from 'react';

const Group = ({ name }) => <div>
  <h2 className='title'>{name}</h2>
</div>;

Group.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Group;
