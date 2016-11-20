import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 添加设备
   * 调用本接口在某个产品下添加一个设备。
   * @param   productId
   * @param  {"mac":"MAC地址"}
   * @return status
   */
  add (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device`, params
    )
  },

  /**
   * 导入设备
   * 用于批量导入设备，如果导入的设备已经存在，则忽略。
   * @param  {Object} params  ["MAC地址1","MAC地址2"]
   * @param           productId
   * @return status
   */
  batchImport (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device_batch`, params
    )
  },

  /**
   * 获取设备信息
   * 获取单个设备详细信息。
   * @param  {productId}
   * @param  {deviceId}
   * @return {Promise}
    {
      "id":"设备ID",
      "mac":"MAC地址",
      "is_active":"是否激活",
      "active_date":"激活时间",
      "is_online":"是否在线",
      "last_login":"最近登录时间",
      "active_code":"激活码",
      "authorize_code":"认证码",
      "mcu_mod":"MCU型号",
      "mcu_version":"MCU版本号",
      "firmware_mod":"固件型号",
      "firmware_version":"固件版本号",
      "corp_id":"企业ID",
      "productId":"产品ID",
      "region_id":"所在区域ID"
    }
   */
  getInfo (productId, deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}`
    )
  },

  /**
   * 查询设备列表
   * @param  {productId}
   * @param  {Object} params
      {
        "offset":"请求列表的偏移量",
        "limit":"请求数量",
        "filter":["字段A","字段B"],
        "query":
      {
        "filed1":{"$in":["字段值","字段值"]},
        "filed3":{"$lt":"字段值"}
      },
      "order":
      {
        "filed1":"desc",
        "filed2":"asc"
      }
    }
   * @return {Promise}
      {
        "count":"实际返回的条目数",
        "list":
        [
          {
            "id":"设备ID",
            "mac":"MAC地址",
            "is_active":"是否激活",
            "active_date":"激活时间",
            "is_online":"是否在线",
            "last_login":"最近登录时间",
            "active_code":"激活码",
            "authorize_code":"认证码",
            "mcu_mod":"MCU型号",
            "mcu_version":"MCU版本号",
            "firmware_mod":"固件型号",
            "firmware":"固件版本号",
            "productId":"产品ID",
            "region_id":"所在区域ID"
          }
        ]
      }
   */
  getList (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/devices`, params
    )
  },
  /**
   * 批量获取虚拟设备数据
   * @param  {productId}
   * @param  {array} deviceIds
    }
   * @return {Promise}
      {
        "list": [
          {
            "0": "数据端点值",
            "1": "数据端点值",
            "deviceId": "设备ID",
            "cm_id": "登录CM服务器ID",
            "ip": "登录IP",
            "online": "是否在线",
            "last_login": "上次登录时间,例：2015-10-09T08:15:40.843Z",
            "last_logout": "上次离线时间,例：2015-10-09T08:15:40.843Z",
            "last_update": "上次数据端点变化时间,例：2015-10-09T08:15:40.843Z"
          }
        ]
      }
   */
  getDeviceDataPoint (productId, deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/v_device/${deviceId}`
    )
  },

  /**
   * 查询设备上下线记录
   * @param  {String} deviceId 设备 ID
   */
  getRecords (params) {
    return http.post(
      `${API_SERVER.default}/v2/device_session_log`, params
    )
  },

  /**
   * 获取数据端点值
   * @param  {String} deviceId 设备 ID
   */
  getDatapointValues (deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/diagnosis/device/probe/${deviceId}`
    )
  },

  /**
   * 获取设备地理信息
   * @param  {String} productId 产品 ID
   * @param  {String} deviceId   设备 ID
   */
  getGeography (productId, deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/geography`
    )
  },

  /**
   * 通过地理信息查询设备
   * @param  {String} productId 产品 ID
   * @param  {String} params     查询参数
   */
  getGeographies (productId, params) {
    // return new Promise((resolve, reject) => {
    //   resolve({
    //     data: {
    //       count: 2,
    //       devices: [{
    //         device_id: 123456,
    //         lat: 23,
    //         lon: 113
    //       }, {
    //         device_id: 123456,
    //         lat: 22,
    //         lon: 114
    //       }]
    //     },
    //     status: 200
    //   })
    // })
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/devices/geography`, params
    )
  },

  /**
   * 生成设备二维码
   */
  genQrcode (productId, deviceId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/qrcode`, params
    )
  },

  /**
   * 获取设备地理信息
   * @param  {String} productId 产品 ID
   * @param  {String} deviceId   设备 ID
   */
  getAggregateDevices (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/aggregate/devices`, params
    )
  }
}
