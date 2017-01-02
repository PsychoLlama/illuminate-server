/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';
import { reducer } from '../../state';
import { createStore } from 'redux';
import expect, { createSpy, spyOn } from 'expect';
import proxyquire from 'proxyquire';

const spy = createSpy().andReturn(<h1>Stubbed component</h1>);

// Named function, used for React's "displayName".
const Group = (...props) => spy(...props);

const {
  default: GroupList,
} = proxyquire.noCallThru()('./GroupList', {
  './Group': Group,
});

describe('A group list', () => {
  let store, list, subscribe;

  beforeEach(() => {
    store = createStore(reducer);
    store.dispatch({
      type: 'SET_GROUPS',
      groups: {
        1: {
          title: 'Lamp',
          lights: ['1', '2'],
        },
      },
    });

    subscribe = spyOn(store, 'subscribe');

    list = mount(<GroupList store={store} />);
  });

  afterEach(() => spy.reset());

  it('should render every group ', () => {
    const groups = list.find('Group');
    expect(groups.length).toBe(1);
  });

  it('should pass the group data to each Group', () => {
    expect(spy).toHaveBeenCalled();

    const [props] = spy.calls[0].arguments;
    const { groups } = store.getState();
    const group = groups[1];

    expect(props).toContain(group);
    expect(props).toContain({ store });
  });

  it('should watch for group updates', () => {
    const [fn] = subscribe.calls[0].arguments;
    store.dispatch({
      type: 'SET_GROUPS',
      groups: {},
    });
    fn();
    const groups = list.find('Group');
    expect(groups.length).toBe(0);
  });

});
