/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import Group from './index';

describe('A group', () => {

  const data = {
    name: 'Living Room',
  };

  it('should display it\'s title', () => {
    const group = shallow(<Group {...data} />);
    const title = group.find('.title').text();
    expect(title).toBe(data.name);
  });

});
