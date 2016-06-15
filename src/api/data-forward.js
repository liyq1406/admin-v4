import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 添加设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addRule (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/dds`, params
    )
  },

  /**
   * 删除设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  deleteRule (productId, dispatchId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/dds/${dispatchId}`
    )
  },

  /**
   * 更新设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateRule (productId, dispatchId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/dds/${dispatchId}`, params
    )
  },

  /**
   * 获取设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getRule (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/dds_list`
    )
  }
}
