import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 用户获取设备快照
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getSnapshot (product_id, device_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/device/${device_id}/snapshot`, params
    )
  },
  /**
   * 获取故障消息列表
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getFault (params) {
    return http.post(
      `${apiServer.default}/v2/corp/messages`, params
    )
  },
  /**
   * 创建产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  createRule (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/snapshot`, params
    )
  },
  /**
   * 获取产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getRule (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/snapshots`
    )
  },
  /**
   * 修改产品快照规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateRule (product_id, params) {
    return http.put(
      `${apiServer.default}/v2/product/${product_id}/snapshot`, params
    )
  },

  /**
   * 删除产品快照规则
   * @param  product_id 产品id， rule_id 规则id
   * @return {Promise}
   */
  deleteRule (product_id, rule_id) {
    return http.del(
      `${apiServer.default}/v2/product/${product_id}/snapshot/${rule_id}`
    )
  }
}
