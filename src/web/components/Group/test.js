/* eslint-env mocha */
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { createFakeGroup } from '../../test-utils';
import Group from './index';

describe('A group', () => {

  const data = createFakeGroup({ name: 'Living Room' });

  it('should display it\'s title', () => {
    const group = shallow(<Group {...data} />);
    const title = group.first().text();
    expect(title).toBe(data.name);
  });

  it('should have class "group"', () => {
    const group = shallow(<Group {...data} />);
    const classes = group.find('div').prop('className');
    expect(classes).toContain('group');
  });

  it('should set a class when all lights are on', () => {
    const data = createFakeGroup({
      state: { 'all_on': true },
    });
    const group = shallow(<Group {...data} />);

    const on = group.find('.all-on');
    expect(on.length).toBe(1);
  });

  it('should call onClick when the group is clicked', () => {
    const spy = createSpy();
    const group = shallow(<Group {...data} onClick={spy} />);
    group.first().simulate('click');
    expect(spy).toHaveBeenCalled();
  });

});
