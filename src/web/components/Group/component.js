import React, { PropTypes } from 'react';

const Group = ({ name, onClick, state }) => {

  const cssClasses = [
    'group',
    state.all_on ? 'all-on' : null,
  ].filter(Boolean);

  return (
    <div className={cssClasses.join(' ')} onClick={onClick}>
      <h2 className='title'>{name}</h2>
    </div>
  );

};

Group.propTypes = {
  state: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Group;
