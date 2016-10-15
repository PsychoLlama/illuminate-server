/* eslint-env mocha*/
import expect, { createSpy, spyOn, restoreSpies } from 'expect';
import axios from 'axios';
import Promise from 'bluebird';
import poll from './index';

describe('A poll', () => {
  let timeout, clear, get, callback;
  const response = Promise.resolve({
    data: 'success',
  });

  const endpoint = 'url.com';
  const interval = 500;

  const failure = new Error('Testing how `poll` handles axios rejections.');

  beforeEach(() => {
    timeout = spyOn(global, 'setTimeout');
    clear = spyOn(global, 'clearTimeout');
    get = spyOn(axios, 'get').andReturn(response);
    callback = createSpy();
  });

  afterEach(restoreSpies);

  it('should start immediately', async () => {

    poll({ endpoint, interval, callback });

    expect(get).toHaveBeenCalled();

    // Wait for one promise tick.
    await Promise.resolve();

    expect(callback).toHaveBeenCalledWith(null, 'success');
  });

  it('should report errors', async () => {

    const rejection = Promise.reject(failure);
    get.andReturn(rejection);

    poll({ endpoint, interval, callback });

    // Wait for one promise tick.
    await Promise.resolve();

    expect(callback).toHaveBeenCalledWith(failure, null);
  });

  it('should set a timeout for the next poll', async () => {
    const interval = 500;

    poll({ endpoint, interval, callback });

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
    const stop = poll({ endpoint, interval, callback });

    stop();

    // Wait for one promise tick.
    await Promise.resolve();

    expect(callback).toNotHaveBeenCalled();
    expect(clear).toHaveBeenCalled();
  });

});
