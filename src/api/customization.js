import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 获取用户自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getUserCustomization () {
    return http.get(
      `${API_SERVER.default}/v2/customization?id=corp.user.list`
    )
  },

  /**
   * 设置用户自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setUserCustomization (params) {
    return http.post(
      `${API_SERVER.default}/v2/customization?id=corp.user.list`, params
    )
  },

  /**
   * 获取设备自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getDeviceCustomization (productId) {
    return http.get(
      `${API_SERVER.default}/v2/customization?id=corp.${productId}.device.list`
    )
  },

  /**
   * 设置设备自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setDeviceCustomization (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/customization?id=corp.${productId}.device.list`, params
    )
  },

  /**
   * 获取产品自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getProductCustomization (productId) {
    return http.get(
      `${API_SERVER.default}/v2/customization?id=corp.product.${productId}.list`
    )
  },

  /**
   * 设置产品自定义属性
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setProductCustomization (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/customization?id=corp.product.${productId}.list`, params
    )
  },

  /**
   * 企业自定义设置 存储key-value值，有则覆盖，无则新增。
   * @param  {[corpId]} 企业ID
   * @param {[params]}  {key: value}
   */
  setCorpCustomization (params) {
    return http.post(
      `${API_SERVER.default}/v2/customization?id=corp`, params
    )
  },

  /**
   * 企业自定义设置 存储key-value值，有则覆盖，无则新增。
   * @param  {[key]}
   */
  getCorpCustomization (keys) {
    let key = ''
    if (Array.isArray(keys)) {
      key = keys.join(',')
    } else {
      key = keys
    }
    return http.get(
      `${API_SERVER.default}/v2/customization?id=corp&key=${key}`
    )
  }
}
