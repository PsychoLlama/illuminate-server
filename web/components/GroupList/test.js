/* eslint-env mocha */
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import expect from 'expect';
import React from 'react';

import { reducer, actions } from './index';
import { GroupList } from './component';

describe('The GroupList reducer', () => {
  let store;

  beforeEach(() => {
    store = createStore(reducer);
  });

  it('should default to an empty group collection', () => {
    const state = store.getState();
    expect(state).toEqual({});
  });

  context('SET_GROUPS action', () => {

    it('should set group state', () => {
      const groups = { overriden: true };

      const action = actions.setGroups(groups);
      store.dispatch(action);

      const state = store.getState();
      expect(state).toEqual(groups);
    });

  });

  context('SET_GROUP action', () => {

    it('should not replace other groups', () => {
      const store = createStore(reducer, { existing: 'group' });

      const action = actions.setGroup('groupName', { updated: true });
      store.dispatch(action);

      const state = store.getState();

      expect(state).toContain({
        existing: 'group',
        groupName: { updated: true },
      });
    });

    it('should set the group given', () => {
      const action = actions.setGroup(1, { name: 'Hall' });
      store.dispatch(action);

      const state = store.getState();
      expect(state).toEqual({
        1: { name: 'Hall' },
      });
    });

  });

});

describe('A collection of groups', () => {

  it('should show every group', () => {
    const data = {
      1: { name: 'Hall' },
      2: { name: 'Lamp' },
    };

    const list = shallow(<GroupList groups={data} />);
    const groups = list.find('Group');
    const msg = 'Failed to add new group.';
    expect(groups.length).toBe(2, msg);
  });

  it('should pass group data to <Group> elements', () => {
    const data = { name: 'Hall', type: 'Room', lights: [] };
    const groups = { 'unique-id': data };

    const list = shallow(<GroupList groups={groups} />);
    const props = list.find('Group').props();
    expect(props).toContain(data);
  });

});
