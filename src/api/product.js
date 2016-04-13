import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 添加产品
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  createProduct (params) {
    return http.post(
      `${apiServer.default}/v2/product`, params
    )
  },

  /**
   * 删除产品
   * @param  {Object} product_id 产品Id
   * @return {Promise}
   */
  deleteProduct (product_id) {
    return http.del(
      `${apiServer.default}/v2/product/${product_id}`
    )
  },

  /**
   * 更新产品信息
   * @param  {Object} product 产品
   * @return {Promise}
   */
  updateProduct (product) {
    var params = {}

    params.name = product.name
    params.description = product.description
    params.link_type = product.link_type
    params.is_registerable = product.is_registerable
    params.is_release = product.is_release
    params.is_active_register = product.is_active_register

    return http.put(
      `${apiServer.default}/v2/product/${product.id}`, params
    )
  },

  /**
   * 获取产品列表
   * @return {Promise}
   */
  getProducts () {
    return http.get(
      `${apiServer.default}/v2/products`
    )
  },

  /**
   * 获取产品详细信息
   * @param  {String} product_id 产品Id
   * @return {Promise}
   */
  getProduct (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}`
    )
  },

  /**
   * 获取产品密钥
   * @param  {String} product_id 产品Id
   * @return {Promise}
   *  {
        "key": "产品密钥"
      }
   */
  getProductKey (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/key`
    )
  },

  /**
   * 添加固件版本
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  addFirmware (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/firmware`, params
    )
  },

  /**
   * 编辑固件版本
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  updateFirmware (product_id, firmware) {
    var params = {}

    params.mod = firmware.mod
    params.version = firmware.version
    params.file_url = firmware.file_url
    params.file_size = firmware.file_size
    params.file_md5 = firmware.file_md5
    params.description = firmware.description
    params.release_date = firmware.release_date
    params.is_release = firmware.is_release

    return http.post(
      `${apiServer.default}/v2/product/${product_id}/firmware/${firmware.id}`, params
    )
  },

  /**
   * 删除固件版本
   * @param  {Object} product_id 产品Id
   * @param  {Object} firmware_id 固件Id
   * @return {Promise}
   */
  deleteFirmware (product_id, firmware_id) {
    return http.del(
      `${apiServer.default}/v2/product/${product_id}/firmware/${firmware_id}`
    )
  },

  /**
   * 获取固件版本列表
   * @return {Promise}
   */
  getFirmwares (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/firmwares`
    )
  },

  /**
   * 添加数据端点
   * @param  {String} product_id 产品Id
   * @param  {Object} params 参数
   * @return {Promise}
   */
  addDataPoint (product_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/datapoint`, params
    )
  },

  /**
   * 更新数据端点
   * @param  {String} product_id 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  updateDataPoint (product_id, datapoint) {
    var params = {}

    params.name = datapoint.name
    params.type = datapoint.type
    params.index = datapoint.index
    params.description = datapoint.description
    params.symbol = datapoint.symbol

    return http.put(
      `${apiServer.default}/v2/product/${product_id}/datapoint/${datapoint.id}`, params
    )
  },

  /**
   * 删除数据端点
   * @param  {String} product_id 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  deleteDataPoint (product_id, datapoint_id) {
    return http.del(
      `${apiServer.default}/v2/product/${product_id}/datapoint/${datapoint_id}`
    )
  },

  /**
   * 获取数据端点
   * @param  {String} product_id 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  getDataPoint (product_id, datapoint_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/datapoint/${datapoint_id}`
    )
  },

  /**
   * 获取数据端点列表
   * @param  {String} product_id 产品Id
   * @return {Promise}
   */
  getDatapoints (product_id) {
    return http.get(
      `${apiServer.default}/v2/product/${product_id}/datapoints`
    )
  },

  /**
   * 产品固件上传
   * @param  {String} product_id  产品 ID
   * @param  {File} file        文件流数据
   * @return {Promise}
    {
      "url":"固件文件资源地址",
      "md5":"文件MD5值",
      "size":"文件大小"
    }
   */
  uploadFirmware (product_id, file) {
    return http.upload(
      `${apiServer.default}/v2/upload/product/${product_id}/firmware`, file
    )
  }
}
