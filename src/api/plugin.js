import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 创建APP配置
   * @param  {Object} params 配置参数
      {
        "name" : "APP名称",
        "type" : "APP类型",
        "plugin" : "插件ID"
      }
   */
  create (params) {
    return http.post(
      `${apiServer.default}/v2/plugin/app`, params
    )
  },

  /**
   * 获取APP详细信息
   * @param  {String} id App标识ID
   */
  get (id) {
    return http.get(
      `${apiServer.default}/v2/plugin/app/${id}`
    )
  },

  /**
   * 获取APP列表
   */
  all () {
    return http.get(
      `${apiServer.default}/v2/plugin/apps`
    )
  },

  /**
   * 修改APP配置
   * @param  {String} id App标识ID
   * @param  {Object} params 通用配置参数
      {
        "name":"APP名称",
        "enable" : true/false,
        "config" : {
          APP配置，不同的插件ID，配置不同，见下方说明
        }
      }
   */
  update (id, params) {
    return http.put(
      `${apiServer.default}/v2/plugin/app/${id}`, params
    )
  },

  /**
   * 删除APP配置
   * @param  {String} id App标识ID
   */
  remove (id) {
    return http.del(
      `${apiServer.default}/v2/plugin/app/${id}`
    )
  },

  /**
   * 申请应用接口调用凭证
   * @param  {String} id App标识ID
   */
  getAppToKen (params) {
    return http.post(
      `${apiServer.default}/v2/plugin/apply_token`, params
    )
  }
}
