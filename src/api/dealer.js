import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 查询经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getDealer (appId, params, token) {
    return http.post(
      `${API_SERVER.dealer}/${appId}/api/distributer/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 新增经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addDealer (appId, params, token) {
    return http.post(
      `${API_SERVER.dealer}/${appId}/api/distributer/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 更新经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateDealer (appId, distributerId, params, token) {
    return http.put(
      `${API_SERVER.dealer}/${appId}/api/distributer/update/${distributerId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 删除经销商信息
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  delDealer (appId, distributerId, token) {
    return http.del(
      `${API_SERVER.dealer}/${appId}/api/distributer/delete/${distributerId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 查询销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getSales (appId, params, token) {
    return http.post(
      `${API_SERVER.dealer}/${appId}/api/sale_details/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 新增销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addSales (appId, params, token) {
    return http.post(
      `${API_SERVER.dealer}/${appId}/api/sale_details/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 更新销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  updateSales (appId, saleDetailsId, params, token) {
    return http.put(
      `${API_SERVER.dealer}/${appId}/api/sale_details/update/${saleDetailsId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 删除销售记录
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  delSales (appId, saleDetailsId, token) {
    return http.del(
      `${API_SERVER.dealer}/${appId}/api/sale_details/delete/${saleDetailsId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
