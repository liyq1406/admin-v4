import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 添加设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addRule (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/dds`, params
    )
  },

  /**
   * 删除设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  deleteRule (product_id, dispatch_id) {
    return http.del(
      `${apiServer.default}/v2/product/${product_id}/dds/${dispatch_id}`
    )
  },

  /**
   * 更新设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateRule (product_id, dispatch_id, params) {
    return http.put(
      `${apiServer.default}/v2/product/${product_id}/dds/${dispatch_id}`, params
    )
  },

  /**
   * 获取设备转发规则
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getRule (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/dds_list`
    )
  }
}
