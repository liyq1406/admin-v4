import * as http from '../http'
import { API_SERVER } from '../consts/config'

export default {
  /**
   * 创建AccessTokey，用于开发者接入。
    @param  {Object} params
    {
      "name":"名称"
    }
    @return {Promise}
    {
      "id":"授权ID",
      "name":"名称",
      "access_token":"授权Token",
      "status":"授权状态"
    }
  */
  createEmpower (params) {
    return http.post(
      `${API_SERVER.default}/v2/empower` + params
    )
  },

  /**
   * 启动授权
    @param  {String} empowerId
    @return {Promise}
  */
  startEmpower (empowerId) {
    return http.post(
      `${API_SERVER.default}/v2/empower/${empowerId}/enable`
    )
  },

  /**
   * 禁用授权
    @param  {String} empowerId
    @return {Promise}
  */
  disableEmpower (empowerId) {
    return http.post(
      `${API_SERVER.default}/v2/empower/${empowerId}/disable`
    )
  },

  /**
   * 删除授权
    @param  {String} empowerId
    @return {Promise}
  */
  deleteEmpower (empowerId) {
    return http.del(
      `${API_SERVER.default}/v2/empower/${empowerId}`
    )
  },

  /**
   * 获取授权列表
    @return {Promise}
    [
      {
        "id":"授权ID",
        "name":"名称",
        "access_token":"授权Token",
        "status":"授权状态"
      }
    ]
  */
  getEmpowers () {
    return http.get(
      `${API_SERVER.default}/v2/empowers`
    )
  },

  // /**
  //  * 获取 v1 旧版的 AccessKey 列表
  //  */
  getAccessKeys () {
    return http.get(
      `${API_SERVER.default}/v1/accesskeys`
    )
  },

  /**
   * 创建Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addKeys (params) {
    return http.post(
      `${API_SERVER.default}/v2/accesskey`, params
    )
  },

  /**
   * 启用或禁用Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  toggleKeys (accesskeyId, status) {
    return http.put(
      `${API_SERVER.default}/v2/accesskey/${accesskeyId}/status/${status}`
    )
  },

  /**
   * 删除Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  deleteKeys (accesskeyId) {
    return http.del(
      `${API_SERVER.default}/v2/accesskey/${accesskeyId}`
    )
  },

  /**
   * 获取Access Key列表
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getKeys () {
    return http.get(
      `${API_SERVER.default}/v2/accesskeys`
    )
  }
}
