/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import { createStore, combineReducers } from 'redux';
import GroupList, { reducer, constants } from './index';

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

      store.dispatch({
        type: constants.SET_GROUPS,
        groups,
      });

      const state = store.getState();
      expect(state).toEqual(groups);
    });

  });

  context('SET_GROUP action', () => {

    it('should not replace other groups', () => {
      const store = createStore(reducer, { existing: 'group' });

      store.dispatch({
        type: constants.SET_GROUP,
        group: { updated: true },
        name: 'groupName',
      });

      const state = store.getState();

      expect(state).toContain({
        existing: 'group',
        groupName: { updated: true },
      });
    });

    it('should set the group given', () => {
      store.dispatch({
        type: constants.SET_GROUP,
        group: { name: 'Hall' },
        name: 1,
      });

      const state = store.getState();
      expect(state).toEqual({
        1: { name: 'Hall' },
      });
    });

  });

});

describe('A collection of groups', () => {
  let store, list;

  beforeEach(() => {
    const appReducer = combineReducers({ groups: reducer });

    const group = { name: 'Hall' };
    const groups = { 1: group };

    store = createStore(appReducer, { groups });
    list = shallow(<GroupList store={store} />);
  });

  it('should contain every group', () => {
    const groups = list.find('Group');

    const { length } = groups;
    const error = `Unexpected number of <Group> elements (${length})`;

    expect(length).toBe(1, error);
  });

  it('should react to changes', () => {
    store.dispatch({
      type: constants.SET_GROUPS,
      groups: {
        1: { name: 'Hall' },
        2: { name: 'Lamp' },
      },
    });

    const groups = list.find('Group');
    const msg = 'Failed to add new group.';
    expect(groups.length).toBe(2, msg);
  });

  it('should pass group data to <Group> elements', () => {
    const data = { name: 'Hall', type: 'Room', lights: [] };
    store.dispatch({
      type: constants.SET_GROUPS,
      groups: { 'unique-id': data },
    });

    const props = list.find('Group').props();
    expect(props).toContain(data);
  });

});
