import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 用户获取设备快照
   * @param  {String} productId 产品ID
   * @param  {String} deviceId  设备ID
   * @param  {Object} params    参数
   * @return {Promise}
   */
  getSnapshot (productId, deviceId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/snapshot`, params
    )
  },

  /**
   * 创建产品快照规则
   * @param  {String} productId 产品ID
   * @param  {Object} params    规则参数
   * @return {Promise}
   */
  createRule (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },

  /**
   * 获取产品快照规则列表
   * @param  {String} productId 产品ID
   * @return {Promise}
   */
  getRules (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshots`
    )
  },

  /**
   * 获取指定产品快照规则
   * @param  {String} productId 产品ID
   * @param  {String} ruleId    规则ID
   * @return {Promise}
   */
  getRule (productId, ruleId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${ruleId}`
    )
  },

  /**
   * 修改产品快照规则
   * @param  {String} productId 产品ID
   * @param  {Object} params    规则参数
   * @return {Promise}
   */
  updateRule (productId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },

  /**
   * 删除产品快照规则
   * @param  {String} productId 产品ID
   * @param  {String} ruleId    规则ID
   * @return {Promise}
   */
  deleteRule (productId, ruleId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${ruleId}`
    )
  }
}
