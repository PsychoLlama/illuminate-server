/* eslint-env mocha */
import Emitter from 'events';

import { createStore, applyMiddleware } from 'redux';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import React from 'react';

import { createFakeGroup } from '../../test-utils';
import { reducer, actions } from './index';
import { GroupList } from './component';

describe('Action', () => {
  let store;

  beforeEach(() => {
    store = createStore(reducer, applyMiddleware(thunk));
  });

  context('setGroups', () => {

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

  context('setGroup', () => {

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

  describe('setGroupState', () => {

    it('should update group state', () => {
      const store = createStore(reducer, {
        1: createFakeGroup({
          state: { on: false },
        }),
      });

      const action = actions.setGroupState(1, {
        on: true,
      });

      store.dispatch(action);

      const { state } = store.getState()[1];
      expect(state).toContain({ on: true });
    });

  });

  context('sendGroupState', () => {
    let emitter, spy, action;
    const UPDATE_GROUPS_EVENT = 'update:groups';

    beforeEach(() => {
      emitter = new Emitter();
      spy = createSpy();

      action = actions.sendGroupState({
        state: { on: true },
        socket: emitter,
        group: 3,
      });
    });

    it('should return a promise', () => {
      const result = store.dispatch(action);
      expect(result.then).toBeA(Function);
    });

    it('should emit updates to the server', () => {
      emitter.on(UPDATE_GROUPS_EVENT, spy);

      store.dispatch(action);

      expect(spy).toHaveBeenCalled();
    });

    it('should resolve when the server finishes', () => {
      emitter.on(UPDATE_GROUPS_EVENT, spy);

      const promise = store.dispatch(action);
      const [{ requestId }] = spy.calls[0].arguments;

      emitter.emit(requestId, null, 'success');

      return promise;
    });

    it('should send the group id and state', () => {
      emitter.on(UPDATE_GROUPS_EVENT, spy);
      const group = 1, state = { on: true };

      const action = actions.sendGroupState({
        socket: emitter,
        group, state,
      });

      store.dispatch(action);

      const [update] = spy.calls[0].arguments;

      expect(update).toContain({ state, group });
    });

    it('should reject if the server returns an error', () => {
      emitter.on(UPDATE_GROUPS_EVENT, spy);

      const promise = store.dispatch(action);
      const [{ requestId }] = spy.calls[0].arguments;

      // Fake server error.
      emitter.emit(requestId, { message: 'no dice' });

      return promise.then(() => {
        throw new Error('Expected promise to reject.');
      }).catch((error) => {
        expect(error).toContain({ message: 'no dice' });
      });
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
    const data = createFakeGroup({
      name: 'Hall',
      type: 'Room',
      lights: [],
    });

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
