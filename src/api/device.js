import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 添加设备
   * 调用本接口在某个产品下添加一个设备。
   * @param   product_id
   * @param  {"mac":"MAC地址"}
   * @return status
   */
  add (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/device`, params
    )
  },

  /**
   * 导入设备
   * 用于批量导入设备，如果导入的设备已经存在，则忽略。
   * @param  {Object} params  ["MAC地址1","MAC地址2"]
   * @param           product_id
   * @return status
   */
  batchImport (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/device_batch`, params
    )
  },

  /**
   * 获取设备信息
   * 获取单个设备详细信息。
   * @param  {product_id}
   * @param  {device_id}
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
      "product_id":"产品ID",
      "region_id":"所在区域ID"
    }
   */
  getInfo (product_id, device_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/device/${device_id}`
    )
  },

  /**
   * 查询设备列表
   * @param  {product_id}
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
            "product_id":"产品ID",
            "region_id":"所在区域ID"
          }
        ]
      }
   */
  getList (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/devices`, params
    )
  },

  /**
   * 获取设备访问 Token
   * @param  {String} deviceId 设备 ID
   */
  getDeviceToken (deviceId, params) {
    return http.post(
      `${apiServer.default}/v2/diagnosis/device/token/${deviceId}`, params
    )
  },

  getDatapointValues (deviceId) {
    return http.get(
      `${apiServer.default}/v2/diagnosis/device/probe/${deviceId}`
    )
  }
}
