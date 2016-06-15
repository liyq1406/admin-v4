import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 查询经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getDealer (appId, params) {
    return http.post(
      `${API_SERVER.default}/module/distributer/${appId}/api/distributer/list`, params
    )
  },

  /**
   * 新增经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addDealer (appId, params) {
    return http.post(
      `${API_SERVER.default}/module/distributer/${appId}/api/distributer/save`, params
    )
  },

  /**
   * 更新经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateDealer (appId, distributerId, params) {
    return http.put(
      `${API_SERVER.default}/module/distributer/${appId}/api/distributer/update/${distributerId}`, params
    )
  },

  /**
   * 删除经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  delDealer (appId, distributerId) {
    return http.delete(
      `${API_SERVER.default}/module/distributer/${appId}/api/distributer/delete/${distributerId}`
    )
  },

  /**
   * 查询销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getSales (appId, params) {
    return http.post(
      `${API_SERVER.default}/module/distributer/${appId}/api/sale_details/list`, params
    )
  },

  /**
   * 新增销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addSales (appId, params) {
    return http.post(
      `${API_SERVER.default}/module/distributer/${appId}/api/sale_details/save`, params
    )
  },

  /**
   * 更新销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateSales (appId, saleDetailsId, params) {
    return http.put(
      `${API_SERVER.default}/module/distributer/${appId}/api/sale_details/update/${saleDetailsId}`, params
    )
  },

  /**
   * 删除销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  delSales (appId, saleDetailsId) {
    return http.put(
      `${API_SERVER.default}/module/distributer/${appId}/api/sale_details/delete/${saleDetailsId}`
    )
  }
}
