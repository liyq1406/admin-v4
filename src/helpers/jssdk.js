import io from 'socket.io-client'
import base64 from './base64'

var _sock = false // socket已连接
var _isDeviceConnected = false // 设备已连接
var _host = 'http://cm.xlink.cn:23777'
var _socketio // 当前socket实例

var XJSObject = {
  invoke: function (name, params, fn) {
    var len = arguments.length
    if (len === 2) {
      if (arguments[1] instanceof Function) {
        fn = params
      }
    }
    switch (name) {
      case 'loadXJSAPILib': // 加载所有资源
        this.base.conSocket(params.host, fn)
        break
      case 'connectXDevice': // 连接设备
        this.base.connectDevice(params, fn)
        break
      case 'stopSocket': // 断开连接
        this.base.stopSocket()
        break
      default:

    }
    return this
  },
  on: function (name, fn) {
    switch (name) {
      case 'onXDeviceStateChange': // 设备状态发⽣生变化
        this.base.onXDeviceStateChange = fn
        break
      case 'onRecvXDeviceData': // 接收到设备发送过来的数据
        this.base.onRecvXDeviceData = fn
        break
      default:
        console.log('no function!')
        break
    }
    return this
  },
  base: {
    b64: base64,
    // 连接socket，如果此host已经创建socket就返回
    conSocket: function (host, fn) {
      if (!_sock) {
        this.socketInit(host || _host, fn)
      } else {
        console.log('socket已初始化')
      }
    },
    // 初始化
    socketInit (host, fn) {
      var self = this
      _socketio = io.connect(host, {
        'reconnect': false,
        'force new connection': true,
        'auto connect': false
      })
      _socketio.on('disconnect', function (e) { // 断开连接
        console.log('socket断开连接')
        _sock = false
        // this.base.fire('disconnect-socket', {
        //   uri: this.io.uri,
        //   isConnecting: false
        // })
      }).on('connect', function (e) { // socket连接
        console.log('socket已连接')
        _sock = true
        fn && fn(e)
        //                            this.base.log('socket init success!')
        // this.base.fire('connect-socket', {
        //   uri: this.io.uri,
        //   socket: this,
        //   isConnecting: true
        // })
      }).on('reconnect', function () { // 恢复连接socket
        console.log('恢复连接socket')
        // this.base.fire('reconnect-socket', {
        //   uri: this.io.uri
        // })
      }).on('connect_failed', function (r) {
        console.log('connect_failed')
        console.log(r)
        // this.base.fire('connect-failed', {
        //   uri: this.io.uri
        // })
      }).on('device.onState', function (r) { // 设备状态发⽣生变化
        console.log(r)
        self.onXDeviceStateChange(r)
        //                        this.base.socketDevState({
        //                            host : this.io.uri,
        //                            data : r
        //                        });
      }).on('device.onRecvData', function (r) { // 接收到设备发送过来的数据
        // console.log(JSON.stringify(r))
        self.onRecvXDeviceData(r)
        //                        this.base.socketDevReSend({
        //                            host : this.io.uri,
        //                            data : r
        //                        });
      })
    },
    // 连接设备
    connectDevice (params, fn) {
      this.socketEmit('device.connect', params, function (r) {
        if (r.status === 200) {
          _isDeviceConnected = true
          console.log(_isDeviceConnected)
        }
        fn && fn(r)
      })
    },
    // 断开socket
    stopSocket () {
      _socketio.disconnect()
    },
    socketEmit: function (command, params, fn) {
      if (_sock) {
        // 延时执行 不然回调不会执行
        window.setTimeout(() => {
          _socketio.emit(command, params, fn)
        }, 200)
      } else {
        this.log('设先连接socket!')
      }
    },
    onRecvXDeviceData () {},
    onXDeviceStateChange () {}
  }
}

module.exports = XJSObject
