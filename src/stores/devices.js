module.exports = {
  state: {
    devices: []
  },

  addDevice: function (device) {
    this.state.devices.unshift(device);
  },

  deleteDevice: function (device) {
    this.state.devices.$remove(device);
  }
};