export const createFakeGroup = (settings = {}) => ({
  action: {
    colormode: 'xy',
    alert: 'select',
    hue: 34076,
    on: false,
    bri: 254,
    sat: 251,
    ct: 153,
  },

  xy: [0.3144, 0.3301],

  state: {
    'all_on': false,
    'any_on': false,
  },

  class: 'Living room',
  name: 'Living Room',
  lights: ['1', '2'],
  type: 'Room',

  ...settings,
});
