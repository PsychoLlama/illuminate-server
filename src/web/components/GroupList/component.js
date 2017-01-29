import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { actions } from './index';
import Group from '../Group';

/**
 * Renders and updates a list of groups.
 * @class
 */
export const GroupList = ({ groups, updateGroup }) => {

  const toGroupComponent = ([id, data]) => (
    <Group {...data} key={id} onClick={() => {
      const on = data.state.any_on;
      updateGroup(id, { on: !on });
    }} />
  );
  const groupComponents = Object
    .entries(groups)
    .filter(([, group]) => group.type === 'Room')
    .map(toGroupComponent);

  return (
    <div className='grouplist'>
      {groupComponents}
    </div>
  );
};

GroupList.propTypes = {
  groups: PropTypes.object.isRequired,
  updateGroup: PropTypes.func,
};

/** Bind <GroupList> to redux. */
export default connect(
  ({ groups }) => ({ groups }),
  (dispatch, { socket }) => ({
    updateGroup: (group, state) => {

      // Update state remotely.
      dispatch(actions.sendGroupState({
        socket,
        group,
        state,
      }));

      // Immediately update local state.
      dispatch(actions.setGroupState(group, {
        ...group.state,
        'any_on': state.on,
        'all_on': state.on,
      }));
    },
  }),
)(GroupList);
