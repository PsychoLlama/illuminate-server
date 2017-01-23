/* eslint-env mocha */
import Emitter from 'events';

import diff from 'deep-diff';

import * as util from './util';
import expect, { createSpy } from 'expect';

describe('Luminary utility', () => {
  let state;

  beforeEach(() => {
    state = {
      on: true,
      hue: 0,
      sat: 0,
      bri: 254,
    };
  });

  const max = {
    hue: 0xffff,
    sat: 254,
    bri: 254,
  };

  const min = {
    hue: 0,
    sat: 0,
    bri: 1,
  };

  describe('"getHuePercentage"', () => {

    it('should return 0 when the hue is at minimum', () => {
      const hue = util.getHuePercentage(min.hue);
      expect(hue).toBe(0);
    });

    it('should return 1 when the hue is maxed out', () => {
      const hue = util.getHuePercentage(max.hue);
      expect(hue).toBe(1);
    });

    it('should return 0.5 when hue is half', () => {
      const hue = util.getHuePercentage(max.hue / 2);
      expect(hue).toBe(0.5);
    });

  });

  describe('"getBriPercentage"', () => {

    it('should return 1 at max brightness', () => {
      const bri = util.getBriPercentage(max.bri);
      expect(bri).toBe(1);
    });

    it('should not return zero at minimum brightness', () => {
      const bri = util.getBriPercentage(min.bri);
      expect(bri).toBeGreaterThan(0);
    });

    it('should return 0.5 at half brightness', () => {
      const bri = util.getBriPercentage(max.bri / 2);
      expect(bri).toBe(0.5);
    });

  });

  describe('"getSatPercentage"', () => {

    it('should return 1 at max saturation', () => {
      const bri = util.getSatPercentage(max.sat);
      expect(bri).toBe(1);
    });

    it('should return zero at minimum saturation', () => {
      const bri = util.getSatPercentage(min.sat);
      expect(bri).toBe(0);
    });

    it('should return 0.5 at half saturation', () => {
      const bri = util.getSatPercentage(max.sat / 2);
      expect(bri).toBe(0.5);
    });

  });

  describe('"getColorFromState"', () => {

    it('should return a string', () => {
      const hex = util.getColorFromState(state);
      expect(hex).toBeA('string');
    });

    it('should return "ffffff" when given white rgb', () => {
      const hex = util.getColorFromState(state);
      expect(hex).toBe('ffffff');
    });

    it('should return "000000" when light is off', () => {
      const hex = util.getColorFromState({ ...state, on: false });
      expect(hex).toBe('000000');
    });

    // Regression test; assertions use previous output.
    it('should return the correct hex code', () => {
      expect(
        util.getColorFromState({ on: true, hue: 100, sat: 100, bri: 100 })
      ).toBe('8c3e3d');
      expect(
        util.getColorFromState({ on: true, hue: 20, sat: 30, bri: 40 })
      ).toBe('2d2323');
      expect(
        util.getColorFromState({ on: true, hue: 35, sat: 250, bri: 3 })
      ).toBe('060000');
    });

  });

  describe('"mergeChanges"', () => {
    let state, update, differences;

    beforeEach(() => {
      state = {
        lights: {},
      };
      update = {
        lights: {
          1: { name: 'Light #1' },
          2: { name: 'Light #2' },
        },
      };
      differences = diff(state, update);
    });

    it('should mutate the given state object', () => {
      const originalLightState = { ...state.lights };
      util.mergeChanges(state, update, differences);

      expect(state.lights).toNotEqual(originalLightState);
    });

    it('should add the all changes', () => {
      util.mergeChanges(state, update, differences);
      expect(state).toEqual(update);
    });

    it('should not replace existing state', () => {
      const light = { name: 'Light #3' };
      state.lights[3] = light;
      util.mergeChanges(state, update, differences);
      expect(state.lights[3]).toEqual(light);
    });

  });

  describe('"createChangeDetector"', () => {
    let state, update, spy, detectChange;

    beforeEach(() => {
      state = {
        lights: {},
      };
      update = {
        lights: {},
      };
      spy = createSpy();
      detectChange = util.createChangeDetector(state, spy);
    });

    it('should not notify if no change has happened', () => {
      detectChange(null, state);
      expect(spy).toNotHaveBeenCalled();
    });

    it('should notify if changes happen', () => {
      update.lights[1] = { name: 'Light #1' };
      detectChange(null, update);
      expect(spy).toHaveBeenCalled();
    });

    // Bound to happen, and our app doesn't care.
    it('should swallow errors', () => {
      detectChange(new Error('This error should be swallowed.'));
      expect(spy).toNotHaveBeenCalled();
    });

    it('should pass the update delta', () => {
      update.lights[2] = { name: 'Light #2' };
      const changes = diff(state, update);
      detectChange(null, update);
      const [differences] = spy.calls[0].arguments;
      expect(differences).toEqual(changes);
    });

  });

  describe('"applyUpdateTo"', () => {
    let state, update, emitter, spy, applyChanges, changes;

    beforeEach(() => {
      state = {
        lights: {},
      };

      update = {
        lights: {
          1: { name: 'Light #1' },
        },
      };

      changes = diff(state, update);

      emitter = new Emitter();
      spy = createSpy();

      emitter.on('update', spy);

      applyChanges = util.applyUpdateTo(state, emitter)('lights');
    });

    it('should add the update to the current state', () => {
      applyChanges(changes, update);

      expect(state.lights).toEqual(update);
    });

    it('should emit an "update" event', () => {
      expect(spy).toNotHaveBeenCalled();
      applyChanges(changes, update);
      expect(spy).toHaveBeenCalled();
    });

    it('should pass the type and deltas to the "update" event', () => {
      applyChanges(changes, update);
      const [type, diff] = spy.calls[0].arguments;
      expect(type).toBe('lights');
      expect(diff).toEqual(changes);
    });

  });

});
