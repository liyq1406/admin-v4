import * as http from '../http'
import { apiServer } from '../consts/config'

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
      `${apiServer.default}/v2/empower` + params
    )
  },

  /**
   * 启动授权
    @param  {String} empower_id
    @return {Promise}
  */
  startEmpower (empower_id) {
    return http.post(
      `${apiServer.default}/v2/empower/${empower_id}/enable`
    )
  },

  /**
   * 禁用授权
    @param  {String} empower_id
    @return {Promise}
  */
  disableEmpower (empower_id) {
    return http.post(
      `${apiServer.default}/v2/empower/${empower_id}/disable`
    )
  },

  /**
   * 删除授权
    @param  {String} empower_id
    @return {Promise}
  */
  deleteEmpower (empower_id) {
    return http.del(
      `${apiServer.default}/v2/empower/${empower_id}`
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
      `${apiServer.default}/v2/empowers`
    )
  },

  // /**
  //  * 获取 v1 旧版的 AccessKey 列表
  //  */
  getAccessKeys () {
    return http.get(
      `${apiServer.default}/v1/accesskeys`
    )
  },

  /**
   * 创建Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  addKeys (params) {
    return http.post(
      `${apiServer.default}/v2/accesskey`, params
    )
  },

  /**
   * 启用或禁用Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  toggleKeys (accesskey_id, status) {
    return http.put(
      `${apiServer.default}/v2/accesskey/${accesskey_id}/status/${status}`
    )
  },

  /**
   * 删除Access Key
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  deleteKeys (accesskey_id) {
    return http.del(
      `${apiServer.default}/v2/accesskey/${accesskey_id}`
    )
  },

  /**
   * 获取Access Key列表
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getKeys () {
    return http.get(
      `${apiServer.default}/v2/accesskeys`
    )
  }
}
