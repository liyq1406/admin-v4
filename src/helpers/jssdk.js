import io from 'socket.io-client'

var XJSObject = {
  invoke: function (name, params, fn) {
    console.log(io)
    var len = arguments.length
    if (len === 2) {
      if (arguments[1] instanceof Function) {
        fn = params
      }
    }
  },
  on: function (name, fn) {
    // switch (name) {
    //   case 'onXDeviceStateChange': // 设备状态发⽣生变化
    //     self.onXDeviceStateChange = fn
    //     break
    //   case 'onRecvXDeviceData': // 接收到设备发送过来的数据
    //     self.onRecvXDeviceData = fn
    //     break
    //   default:
    //     self.log('no function!')
    //     break
    // }
    return this
  }
  // b64: self.base64()
}

module.exports = XJSObject
