import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

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
      `${API_SERVER.default}/v2/plugin/app`, params
    )
  },

  /**
   * 获取APP详细信息
   * @param  {String} id App标识ID
   */
  get (id) {
    return http.get(
      `${API_SERVER.default}/v2/plugin/app/${id}`
    )
  },

  /**
   * 获取APP列表
   */
  all () {
    return http.get(
      `${API_SERVER.default}/v2/plugin/apps`
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
      `${API_SERVER.default}/v2/plugin/app/${id}`, params
    )
  },

  /**
   * 删除APP配置
   * @param  {String} id App标识ID
   */
  remove (id) {
    return http.del(
      `${API_SERVER.default}/v2/plugin/app/${id}`
    )
  },

  /**
   * 申请应用接口调用凭证
   * @param  {String} id App标识ID
   */
  getAppToKen (params) {
    return http.post(
      `${API_SERVER.default}/v2/plugin/apply_token`, params
    )
  },
  /**
   * 设置Android APP版本信息
   * @param  {String} id App标识ID
   */
  setAndVersion (id, params) {
    return http.post(
      `${API_SERVER.default}/v2/plugin/app_android_apk/${id}`, params
    )
  },
  /**
   * 获取Android APK最新版本
   * @param  {String} id App标识ID
   */
  getAndVersion (id, corpId) {
    return http.get(
      `${API_SERVER.default}/v2/plugin/app_android_apk/${id}/latest?corp_id=${corpId}`
    )
  },
  /**
   * 上传SplashWnd图片
   * @param
   */
  updatePic (params) {
    return http.upload(
      `${API_SERVER.default}/v2/plugin/app_splashwnd_upload`, params
    )
  },
  /**
   * 添加SplashWnd图片接口
   * @param
   */
  addSplashWnd (params) {
    return http.post(
      `${API_SERVER.default}/v2/plugin/app_splashwnd`, params
    )
  },
  /**
   * 删除SplashWnd图片接口
   * @param
   */
  delSplashWnd (appId, pictureId) {
    return http.del(
      `${API_SERVER.default}/v2/plugin/app_splashwnd/${appId}/${pictureId}`
    )
  },
  /**
   * 获取SplashWnd图片列表
   * @param
   */
  getSplashWnd (params) {
    return http.post(
      `${API_SERVER.default}/v2/plugin/app_splashwnd_list`, params
    )
  },
  /**
   * 获取SplashWnd图片详情
   * @param
   */
  getSingleSplashWnd (appId, pictureId) {
    return http.get(
      `${API_SERVER.default}/v2/plugin/app_splashwnd/${appId}/${pictureId}`
    )
  }
}
