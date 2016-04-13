import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * [create description]
   * @param  {[type]} product_id [description]
   * @param  {[type]} params     [description]
   * @return {Promise}
    {//IOS
      "id":"APP的标识ID",
      "name":"APP名称",
      "type":"APP类型",
      "apn_enable":"APN推送是否启用",
      "apn_license_url":"APN密钥文件地址",
      "apn_license_pwd":"APN密钥文件密码",
      "create_time":"创建时间"
    }
    {//安卓
      "name":"APP名称",
      "type":"APP类型",
      "android":{
          "gcm_api_key":"安卓调用推送所需要的api key",
          "gcm_enable":"gcm推送是否启用"
      }
    }
   */
  create (params) {
    return http.post(
      `${apiServer.default}/v2/developer/app`, params
    )
  },

  /**
   * 更新应用信息
   * @param  {Object} app 目标应用
   * @return {Promise}
   */
  update (app) {
    var params = {}

    params.name = app.name
    params.type = app.type

    if (app.type === 1) { // iOS应用
      params.apn_enable = app.apn_enable
      params.apn_license_url = app.apn_license_url
      params.apn_license_pwd = app.apn_license_pwd
      params.apn_license_production = app.apn_license_production
    } else if (app.type === 2) { // 安卓应用
      params.name = app.name
      params.type = app.type
      params.gcm_api_key = app.android.gcm_api_key
      params.gcm_enable = app.android.gcm_enable
    } else if (app.type === 4) { // 微信应用
      params.wechat = {}
      params.wechat.id = app.wechat.id // 微信公众号中的微信号
      params.wechat.app_id = app.wechat.app_id // 微信公众号中的 appID
      params.wechat.app_secret = app.wechat.app_secret // 微信公众号的 appsecrect
      params.wechat.encrypt = app.wechat.encrypt // 消息加解密方式
      params.wechat.key = app.wechat.key // 43位 AESKey
      params.app_url = app.app_url // 云智易 APP 接收微信消息 URL
    }

    return http.put(
      `${apiServer.default}/v2/developer/app/${app.id}`, params
    )
  },

  /**
   * 获取APP详细信息
   * @return {Promise}
   */
  getinfo (app_id) {
    return http.get(
      `${apiServer.default}/v2/developer/app/${app_id}`
    )
  },

  /**
   * 获取应用列表
   * @return {Promise}
   */
  list () {
    return http.get(
      `${apiServer.default}/v2/developer/apps`
    )
  },

  /**
   * 删除应用
   * @param  {Object} app 目标应用
   * @return {Promise}
   */
  remove (id) {
    return http.del(
      `${apiServer.default}/v2/developer/app/${id}`
    )
  },

  /**
   * 微信授权配置
   * @param  {Object}
   * {
        "auth_key": "",
        "close_strategy": "",
        "conn_strategy": "",
        "crypt_method": "",
        "auth_ver": "",
        "connect_protocol":"",
        "manu_mac_pos":"",
        "ser_mac_pos":"",
        "product_id":""
   * }
   * @return {Promise}
   * {
        "auth_key": "",
        "close_strategy": "",
        "conn_strategy": "",
        "crypt_method": "",
        "auth_ver": "",
        "connect_protocol":"",
        "manu_mac_pos":"",
        "ser_mac_pos":"",
        "product_id":""
   * }
   */
  empowerWechat (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/config`, params
    )
  },

  /**
   * 新增授权设备
   * @param  {Object}
   * {
        "mac": ""
      }
   * @return {Promise}
   */
  createWechat (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/device`, params
    )
  },

  /**
   * 批量新增授权设备
   * @param  {Object}
   * {
        "mac": ""
      }
   * @return {Promise}
   * ["mac1","mac2", "mac3"]
   */
  createMultiWechat (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/device_batch`, params
    )
  },

  /**
   * 查询授权设备列表
   * @param  {Object}
   * {
      "offset": "请求的列表偏移量",
      "limit": "请求的列表数量",
      "query": {
          "field1": {
              "$in": [
                  " 字段值",
                  " 字段值"
              ]
          },
          "field2": "字段值"
      },
      "order": {
          "filed1": "desc",
          "filed2": "asc"
      }
    }
   * @return {Promise}
   * {
      "count": "总数",
      "list": [
          {
              "device_id": "设备ID",
              "app_id": "应用ID",
              "product_id": "产品ID",
              "mac": "MAC地址",
              "w_device_id": "微信设备ID",
              "w_device_type": "微信设备类型",
              "status": "授权状态"
          }
      ]
    }
   */
  searchWechatList (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/devices`, params
    )
  },

  /**
   * 再次授权设备
   * @param  {Object}
   * [
      "device_id1",
      "device_id2",
      "device_id3"
    ]
   * @return {Promise}
   */
  reEmpowerWechat (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/device_auth`, params
    )
  },

  /**
   * 产品授权
   */
  productEmpower (app_id, product_id, params) {
    return http.post(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}`, params
    )
  },

  /**
   * 获取产品授权状态
   * @return
   * {
      "status": 授权状态
    }
   */
  productEmpowerStatus (app_id, product_id) {
    return http.get(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/status`
    )
  },

  /**
   * 获取微信授权配置
   * @param  {Object}
   * @return {Promise}
   * {
      "app_id": "应用ID",
      "product_id": "产品ID",
      "auth_config": {
          "auth_key": "",
          "close_strategy": "1",
          "conn_strategy": "1",
          "crypt_method": "0",
          "auth_ver": "1",
          "connect_protocol": "1",
          "manu_mac_pos": "-1",
          "ser_mac_pos": "-1",
          "product_id": "1"
      }
  }
   */
  getWechat (app_id, product_id) {
    return http.get(
      `${apiServer.default}/v2/developer/app/${app_id}/wechat_auth/product/${product_id}/config`
    )
  }
}
