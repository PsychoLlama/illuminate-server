/* eslint-env mocha */
import reducer from './reducer';
import expect from 'expect';

describe('The group reducer', () => {

  it('should initially return an object', () => {
    const result = reducer(undefined, {
      type: 'initial',
    });

    expect(result).toEqual({});
  });

  it('should return the current state', () => {
    const result = reducer({
      existing: true,
    }, {
      type: 'SOMETHING_IRRELEVANT',
    });

    expect(result).toEqual({ existing: true });
  });

  context('SET_GROUPS action', () => {

    it('should replace the groups', () => {
      const result = reducer({
        initial: true,
      }, {
        type: 'SET_GROUPS',
        groups: { replaced: true },
      });

      expect(result).toEqual({ replaced: true });
    });

  });

});
