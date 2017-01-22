/* eslint-env mocha */
import expect, { createSpy } from 'expect';
import proxy from 'proxyquire';
import diff from 'deep-diff';
import Emitter from 'events';

// Mocks.
const mock = {
  poll: createSpy(),
  io: createSpy(),
};

mock.io.listen = mock.io;

const {
  default: server,
  detectChange,
  mergeChanges,
  handleChange,
  state,
} = proxy.noCallThru().load('./index', {
  '../poll': mock.poll,
  'socket.io': mock.io,
  '../setup/result': {
    baseURL: 'http://fake-url.internetz',
  },
});

describe('The server', () => {

  beforeEach(() => mock.io.reset());
  beforeEach(() => {
    state.lights = {};
    state.groups = {};
  });

  describe('state', () => {

    it('should contain Hue information', () => {
      expect(state.lights).toBeAn(Object);
      expect(state.groups).toBeAn(Object);
    });

  });

  describe('change detector', () => {
    const state = {};
    const spy = createSpy();

    beforeEach(::spy.reset);

    it('should not fire if no changes happen', () => {
      const detector = detectChange(state, spy);

      detector(null, state);

      expect(spy).toNotHaveBeenCalled();
    });

    it('should fire if changes happen', () => {
      const detector = detectChange(state, spy);
      const update = { 'new-property': true };

      detector(null, update);

      expect(spy).toHaveBeenCalled();
    });

    it('should not detect changes if an error occurs', () => {
      const detector = detectChange(state, spy);

      const error = new Error('Testing if the diff happens if error');
      detector(error);

      expect(spy).toNotHaveBeenCalled();
    });

    it('should provide the state and it\'s changes to the callback', () => {
      const detector = detectChange(state, spy);
      const update = { things: 'yeah, probably' };
      const changes = diff(state, update);

      detector(null, update);

      const args = spy.calls[0].arguments;
      expect(args).toEqual([changes, update]);
    });

  });

  describe('change merger', () => {
    let state, update;

    beforeEach(() => {
      state = { old: true };
      update = { old: false };
    });

    it('should mutate the original state', () => {
      const changes = diff(state, update);

      mergeChanges(state, update, changes);

      expect(state).toEqual(update);
    });

    it('should return the list of changes', () => {
      const changes = diff(state, update);

      const result = mergeChanges(state, update, changes);

      expect(result).toEqual(changes);
    });

  });

  describe('change handler', () => {
    let state, update, emitter;
    const spy = createSpy();

    beforeEach(::spy.reset);

    beforeEach(() => {
      state = { old: true };
      update = { old: false };
      emitter = new Emitter();
    });

    it('should emit updates for changes', () => {
      const handler = handleChange([emitter], 'event-name', state);
      const changes = diff(state, update);

      emitter.on('change:event-name', spy);

      handler(changes, update);

      expect(spy).toHaveBeenCalledWith(changes);
    });

    it('should update the current state', () => {
      const handler = handleChange([emitter], 'stuff', state);
      const changes = diff(state, update);

      expect(state).toNotEqual(update);

      handler(changes, update);

      expect(state).toEqual(update);
    });

  });

  describe('factory', () => {
    let emitter;

    beforeEach(() => {
      emitter = new Emitter();
      emitter.sockets = emitter;

      mock.io.andReturn(emitter);
    });

    it('should mount a socket server', () => {
      server(8080);
      expect(mock.io).toHaveBeenCalledWith(8080);
    });

    it('should send updates as they happen', () => {
      server(8080);
      const spy = createSpy();

      const [callback] = mock.poll.calls
        .map((call) => call.arguments[0])
        .filter(({ endpoint }) => (/lights/).test(endpoint))
        .map((args) => args.callback);

      emitter.on('change:lights', spy);

      callback(null, { potato: true });

      expect(spy).toHaveBeenCalled();
    });

    it('should return the new socket.io server', () => {
      const result = server(8080);
      expect(result).toBe(emitter);
    });

    it('should send state on connection', () => {
      const client = new Emitter();
      const spy = createSpy();

      server(8080);

      client.on('state', spy);
      emitter.emit('connection', client);

      expect(spy).toHaveBeenCalledWith(state);
    });

  });

});
