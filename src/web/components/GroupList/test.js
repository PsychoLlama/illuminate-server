/* eslint-env mocha */
/* eslint-disable camelcase */
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import expect from 'expect';
import React from 'react';

import { reducer, actions } from './index';
import { GroupList } from './component';

const createFakeGroup = (settings = {}) => ({
  action: {
    colormode: 'xy',
    alert: 'select',
    hue: 34076,
    on: false,
    bri: 254,
    sat: 251,
    ct: 153,
  },

  xy: [0.3144, 0.3301],

  state: {
    all_on: false,
    any_on: false,
  },

  class: 'Living room',
  name: 'Living Room',
  lights: ['1', '2'],
  type: 'Room',

  ...settings,
});

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

    it('should replace all group state', () => {
      const initialState = { 1: createFakeGroup() };
      const store = createStore(reducer, initialState);
      const update = { 2: createFakeGroup() };

      const action = actions.setGroups(update);
      store.dispatch(action);

      const state = store.getState();
      expect(state).toNotContain(initialState);
      expect(state).toEqual(update);
    });

  });

  context('SET_GROUP action', () => {

    it('should not replace other groups', () => {
      const original = createFakeGroup({ name: 'Existing' });
      const update = createFakeGroup({ name: 'Updated' });

      const store = createStore(reducer, { 1: original });

      const action = actions.setGroup(2, update);
      store.dispatch(action);

      const state = store.getState();

      expect(state).toContain({ 1: original, 2: update });
    });

    it('should set the group given', () => {
      const update = createFakeGroup({ name: 'Hall' });
      const action = actions.setGroup(1, update);
      store.dispatch(action);

      const state = store.getState();
      expect(state).toEqual({ 1: update });
    });

  });

});

describe('A collection of groups', () => {

  it('should show every group', () => {
    const data = {
      1: createFakeGroup({ name: 'Hall' }),
      2: createFakeGroup({ name: 'Lamp' }),
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

  it('should filter out non-room group types', () => {
    const groups = {
      1: createFakeGroup({ type: 'Room', name: 'Hall' }),
      2: createFakeGroup({ type: 'LightGroup', name: 'Lamp' }),
    };

    const list = shallow(<GroupList groups={groups} />);
    const msg = 'Failed to ignore LightGroup room type.';
    expect(list.find('Group').length)
      .toBeGreaterThan(0)
      .toBeLessThan(2, msg);
  });

});
