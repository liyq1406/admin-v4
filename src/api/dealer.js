import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 添加经销商
   * @param  {Object} params 经销商信息
   *  {
        "name" : "经销商名称",
        "email" : "邮箱地址",
        "phone" : "手机",
        "password":"登录密码"，
        "address":"联系地址",
        "upper_dealer_code":"上级经销商代码"
      }
   * @return {Promise}
   */
  create (params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer`, params
    )
  },

  /**
   * 修改经销商
   * @param  {String} id     经销商 id
   * @param  {Object} params 经销商信息
   *  {
        "name" : "经销商名称",
        "address":"联系地址"
      }
   * @return {Promise}
   */
  update (id, params) {
    return http.put(
      `${API_SERVER.default}/v2/dealer/${id}`, params
    )
  },

  /**
   * 禁用经销商
   * @param  {String} id     经销商 id
   * @return {Promise}
   */
  disable (id) {
    return http.put(
      `${API_SERVER.default}/v2/dealer/${id}`
    )
  },

  /**
   * 删除经销商
   * @param  {String} id     经销商 id
   * @return {Promise}
   */
  del (id) {
    return http.del(
      `${API_SERVER.default}/v2/dealer/${id}`
    )
  },

  /**
   * 获取经销商列表
   * @param  {Object} params  查询条件
   * @return {Promise}
   */
  list (params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer_list`, params
    )
  },
  /**
   * 修改经销商状态
   * @param  {Object} params
   * @return {Promise}
   */
  toggle (dealerId, status) {
    return http.put(
      `${API_SERVER.default}/v2/dealer/${dealerId}/status/${status}`
    )
  },

  /**
   * 获取单个经销商
   * @param  {Object} params  查询条件
   * @return {Promise}
   */
  get (code) {
    return http.get(
      `${API_SERVER.default}/v2/dealer/${code}`
    )
  },

  /**
   * 经销商登陆认证
   * @param  {Object} params 认证信息
   * @return {Promise}
   */
  auth (params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer_auth`, params
    )
  },
  /**
   * 获取销售信息
   * @param  {Object} params 认证信息
   * @return {Promise}
   */
  getSales (dealerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer/${dealerId}/sale_summary`, params
    )
  },

  /**
   * 获取客户详细信息
   * @param  {String} clientInfoId
   * @return {Promise}
   */
  getUser (clientInfoId) {
    return http.get(
      `${API_SERVER.default}/v2/dealer/client_info/${clientInfoId}`
    )
  },
  /**
   * 添加客户信息(销售记录)
   * @param  {String} dealerId 经销商id
   * @return {Promise}
   */
  addClientInfo (dealerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer/${dealerId}/add_client_info/upload`, params
    )
  },
  /**
   * 修改客户信息(销售记录)
   * @param  {String} clientInfoId 销售信息id
   * @return {Promise}
   */
  editClientInfo (clientInfoId, params) {
    return http.put(
      `${API_SERVER.default}/v2/dealer/client_info/${clientInfoId}`, params
    )
  },
  /**
   * 添加客户信息(销售记录)
   * @param  {String} clientInfoId 认证信息
   * @return {Promise}
   */
  delClientInfo (clientInfoId) {
    return http.del(
      `${API_SERVER.default}/v2/dealer/client_info/${clientInfoId}`
    )
  },
  /**
   * 获取经销商入口配置
   * @param  {String}
   * @return {Promise}
   */
  getConfig (dealerId, corpId) {
    return http.get(
      `${API_SERVER.default}/v2/dealer/${dealerId}/entry_config?corp_id=${corpId}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          // 'Access-Token': '1111'
        }
      }
    )
  },
  /**
   * 设置经销商入口配置
   * @param  {String}
   * @return {Promise}
   */
  setConfig (dealerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer/${dealerId}/entry_config`, params
    )
  },
  /**
   * 经销商登录认证
   * @param  {Object} params 登录信息
      {
        'account': '手机号/邮箱地址',
        'password': '登陆密码'
      }
   * @return {Promise}
   */
  login (params) {
    return http.post(
      `${API_SERVER.default}/v2/dealer_auth`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
