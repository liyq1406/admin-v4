module.exports = {
  state: {
    devices: []
  },

  addDevice (device) {
    this.state.devices.unshift(device)
  },

  deleteDevice (device) {
    this.state.devices.$remove(device)
  }
}
