/* eslint-env mocha*/
import { Search, search, connect } from './index';
import { hostname } from 'os';
import axios from 'axios';
import expect, {
  restoreSpies,
  createSpy,
  spyOn,
} from 'expect';


describe('Hue bridge', () => {
  const spies = {};
  let post;

  beforeEach(() => {
    spies.on = spyOn(Search.prototype, 'on');
    spies.start = spyOn(Search.prototype, 'start');
    spies.stop = spyOn(Search.prototype, 'stop');
    spies.off = spyOn(Search.prototype, 'off');

    const resolved = Promise.resolve({
      data: [{
        success: {},
      }],
    });

    post = spyOn(axios, 'post').andReturn(resolved);
  });

  afterEach(restoreSpies);

  describe('search', () => {

    it('should initiate a search', () => {
      const spy = createSpy();
      search(spy);
      expect(spies.start).toHaveBeenCalled();
    });

    it('should notify when bridges are discovered', () => {
      const bridge = { 'fake-bridge': true };
      const spy = createSpy();

      search(spy);

      expect(spies.on).toHaveBeenCalled();

      // Manually notify discovery.
      spies.on.calls[0].arguments[1](bridge);
      spies.on.calls[0].arguments[1](bridge);

      expect(spy.calls.length).toBe(2);
      expect(spy).toHaveBeenCalledWith(bridge);
    });

    it('should return a function', () => {
      const spy = createSpy();
      const result = search(spy);

      expect(result).toBeA(Function);
    });

    it('should quit when stop is called', () => {
      const spy = createSpy();
      const stop = search(spy);

      spies.on.calls[0].arguments[1]();

      stop();

      expect(spies.stop).toHaveBeenCalled();
      expect(spies.off).toHaveBeenCalled();
    });

  });

  describe('connect', () => {
    const url = 'http://url.com';
    const noop = () => {};
    const success = {
      data: [{
        success: {},
      }],
    };

    beforeEach(() => {
      const resolved = Promise.resolve(success);
      post.andReturn(resolved);
    });

    it('should throw if nothing is passed', () => {
      expect(connect, noop).toThrow();
    });

    it('should post to the bridge', () => {
      const stop = connect(url, noop);

      stop();

      expect(post).toHaveBeenCalled();
    });

    it('should post the devicetype', () => {
      const stop = connect(url, noop);

      stop();

      expect(post).toHaveBeenCalledWith(url, {
        devicetype: `luminary#${hostname()}`,
      });
    });

    it('should end polling when successful', async () => {
      const spy = createSpy();
      connect(url, spy);

      await Promise.resolve();

      const result = success.data[0].success;
      expect(spy).toHaveBeenCalledWith(result);
    });

    it('should return a function', () => {
      const stop = connect(url, noop);
      expect(stop).toBeA(Function);
      stop();
    });

    it('should stop polling when stop is called', async () => {
      const spy = createSpy();
      const stop = connect(url, noop);
      stop();
      const original = spy.calls.length;
      await Promise.resolve();

      expect(spy.calls.length).toBe(original);
    });

  });

});
