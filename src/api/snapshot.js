import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 用户获取设备快照
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getSnapshot (productId, deviceId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/snapshot`, params
    )
  },
  /**
   * 获取故障消息列表
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getFault (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/messages`, params
    )
  },
  /**
   * 创建产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  createRule (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },
  /**
   * 获取产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getRule (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshots`
    )
  },
  /**
   * 修改产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateRule (productId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },

  /**
   * 删除产品快照规则
   * @param  productId 产品id， ruleId 规则id
   * @return {Promise}
   */
  deleteRule (productId, ruleId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${ruleId}`
    )
  }
}
