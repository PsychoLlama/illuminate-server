/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import expect, { createSpy } from 'expect';
import { createStore } from 'redux';
import { reducer } from '../../state';
import Group from './Group';

describe('A group', () => {
  let store, data;

  beforeEach(() => {
    store = createStore(reducer);
    data = {
      name: 'Living Room',
      lights: ['1', '2'],
      store,
    };
  });

  it('should render the group name', () => {
    const group = shallow(<Group {...data} />);
    const name = group.find('h1');
    expect(name.text()).toBe(data.name);
  });

  it('should fire an onToggle event when clicked', () => {
    const spy = createSpy();
    const group = shallow(<Group {...data} onToggle={spy} />);
    expect(spy).toNotHaveBeenCalled();
    group.simulate('click');
    expect(spy).toHaveBeenCalled();
  });

});
