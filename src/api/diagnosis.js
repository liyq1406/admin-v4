import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 获取设备访问 Token
   * @param  {String} deviceId 设备 ID
   */
  getDeviceToken (deviceId, params) {
    return http.post(
      `${apiServer.default}/v2/diagnosis/device/token/${deviceId}`, params
    )
  },

  /**
   * 设置设备属性 Token
   * @param  {String} deviceId 设备 ID
   */
  setDeviceAttribute (deviceId, params) {
    return http.post(
      `${apiServer.default}/v2/diagnosis/device/set/${deviceId}`, params
    )
  }
}
