// import io from 'socket.io-client'
import base64 from './base64'

var _sock = false // socket已连接
var _isDeviceConnected = false // 设备已连接
var _host = 'http://cm.xlink.cn:23777'
var _socketio // 当前socket实例
var _deviceid = ''

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
      case 'sendXDeviceData': // 发送数据到设备
        if (_isDeviceConnected) {
          this.base.sendDate(params, fn)
        } else { // 未连接设备
          fn && fn('unconnect device!')
        }
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
    /**
     * 向设备发送数据
     * @param  {String}   data base64
     * @param  {Function} fn   [description]
     * @return {[type]}        [description]
     */
    sendDate (params, fn) {
      // var data = this.b64.encode(params.data)
      // params.data = this.toAscii(params.data)
      // params.data = this.b64.encode(params.data)
      params.data = window.btoa(params.data)
      params.appid = '1231231'
      params.deviceid = _deviceid
      params.token = '123123'
      // console.log('发送的数据是： ' + JSON.stringify(params))
      this.socketEmit('device.senddata', params, function (r) {
        fn && fn(r)
      })
    },
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
        if (r.type === 'base64') {
          r.data = window.atob(r.data)
        }
        self.onRecvXDeviceData(r)
        //                        this.base.socketDevReSend({
        //                            host : this.io.uri,
        //                            data : r
        //                        });
      })
    },
    // 连接设备
    connectDevice (params, fn) {
      // 延时执行 不然回调不会执行
      window.setTimeout(() => {
        this.socketEmit('device.connect', params, function (r) {
          if (r.status === 200) {
            _deviceid = params.deviceid
            _isDeviceConnected = true
            console.log(_isDeviceConnected)
            console.log('_deviceid' + _deviceid)
          }
          fn && fn(r)
        })
      }, 200)
    },
    // 断开socket
    stopSocket () {
      _socketio.disconnect()
    },
    socketEmit: function (command, params, fn) {
      if (_sock) {
        console.log('command:' + command)
        console.log('params:' + JSON.stringify(params))
        console.log('fn:' + fn)
        _socketio.emit(command, params, fn)
      } else {
        console.log('设先连接socket!')
      }
    },
    onRecvXDeviceData () {},
    onXDeviceStateChange () {},
    toAscii (data) {
      // data = data.replace(/\//, '')
      var result = []
      var arr = data.split('')
      for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].charCodeAt().toString(16))
      }
      return result
    }
  }
}

module.exports = XJSObject
