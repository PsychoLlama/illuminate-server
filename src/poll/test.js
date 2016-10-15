/* eslint-env mocha*/
import expect, { createSpy, spyOn, restoreSpies } from 'expect';
import axios from 'axios';
import Promise from 'bluebird';
import poll from './index';

describe('A poll', () => {
  let timeout, clear, get;
  const response = Promise.resolve({
    data: 'success',
  });

  const failure = new Error('Testing how `poll` handles axios rejections.');

  beforeEach(() => {
    timeout = spyOn(global, 'setTimeout');
    clear = spyOn(global, 'clearTimeout');
    get = spyOn(axios, 'get').andReturn(response);
  });

  afterEach(restoreSpies);

  it('should start immediately', async () => {
    const cb = createSpy();

    poll('url.com', 500, cb);
    expect(get).toHaveBeenCalled();

    // Wait for one promise tick.
    await Promise.resolve();

    expect(cb).toHaveBeenCalledWith(null, 'success');
  });

  it('should report errors', async () => {
    const cb = createSpy();

    const rejection = Promise.reject(failure);
    get.andReturn(rejection);
    poll('url.com', 500, cb);

    // Wait for one promise tick.
    await Promise.resolve();

    expect(cb).toHaveBeenCalledWith(failure, null);
  });

  it.only('should set a timeout for the next poll', async () => {
    const interval = 500;
    poll('url.com', interval, () => {});

    // Check after two promise ticks.
    await Promise.resolve();
    await Promise.resolve();

    expect(timeout).toHaveBeenCalled();
    const [fn, time] = timeout.calls[0].arguments;

    expect(time).toBe(interval);

    // Simulate a timeout event.
    fn();

    // Two more ticks, the request should finish.
    await Promise.resolve();
    await Promise.resolve();

    // The timeout should've been set for the next poll.
    expect(timeout.calls.length).toBe(2);
  });

  it('should end polling when stop is called', async () => {
    const spy = createSpy();
    const stop = poll('url.com', 500, spy);
    stop();

    // Wait for one promise tick.
    await Promise.resolve();

    expect(spy).toNotHaveBeenCalled();
    expect(clear).toHaveBeenCalled();

  });

});
