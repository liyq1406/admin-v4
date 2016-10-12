import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 获取设备互联应用的限制
   */
  getLimit (corpId, plugin) {
    return http.get(
      `${API_SERVER.default}/v2/plugin/interconnect_datapoint/corp/${corpId}?plugin_type=${plugin}`
    )
  },

  /**
   * 获取设备互联应用的限制
   */
  setLimit (corpId, params) {
    return http.post(
      `${API_SERVER.default}/v2/plugin/interconnect_datapoint/corp/${corpId}`, params
    )
  }
}
