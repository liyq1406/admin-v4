import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 添加产品
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  create (params) {
    return http.post(
      `${API_SERVER.default}/v2/product`, params
    )
  },

  /**
   * 删除产品
   * @param  {Object} productId 产品Id
   * @return {Promise}
   */
  deleteProduct (productId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}`
    )
  },

  /**
   * 更新产品信息
   * @param  {Object} product 产品
   * @return {Promise}
   */
  updateProduct (product) {
    // var params = {}
    //
    // params.name = product.name
    // params.description = product.description
    // params.link_type = product.link_type
    // params.is_registerable = product.is_registerable
    // params.is_release = product.is_release
    // params.is_active_register = product.is_active_register
    // params.is_allow_multi_admin = product.is_allow_multi_admin

    return http.put(
      `${API_SERVER.default}/v2/product/${product.id}`, product
    )
  },

  /**
   * 获取产品列表
   * @return {Promise}
   */
  all () {
    return http.get(
      `${API_SERVER.default}/v2/products`
    )
  },

  /**
   * 获取产品详细信息
   * @param  {String} productId 产品Id
   * @return {Promise}
   */
  getProduct (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}`
    )
  },

  /**
   * 获取产品密钥
   * @param  {String} productId 产品Id
   * @return {Promise}
   *  {
        "key": "产品密钥"
      }
   */
  getProductKey (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/key`
    )
  },

  /**
   * 添加固件版本
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  addFirmware (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/firmware`, params
    )
  },

  /**
   * 编辑固件版本
   * @param  {Object} params 产品信息
   * @return {Promise}
   */
  updateFirmware (productId, firmware) {
    var params = {}

    params.mod = firmware.mod
    params.version = firmware.version
    params.file_url = firmware.file_url
    params.file_size = firmware.file_size
    params.file_md5 = firmware.file_md5
    params.description = firmware.description
    params.release_date = firmware.release_date
    params.is_release = firmware.is_release

    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/firmware/${firmware.id}`, params
    )
  },

  /**
   * 删除固件版本
   * @param  {Object} productId 产品Id
   * @param  {Object} firmwareId 固件Id
   * @return {Promise}
   */
  deleteFirmware (productId, firmwareId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/firmware/${firmwareId}`
    )
  },

  /**
   * 获取固件版本列表
   * @return {Promise}
   */
  getFirmwares (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/firmwares`, params
    )
  },

  /**
   * 添加数据端点
   * @param  {String} productId 产品Id
   * @param  {Object} params 参数
   * @return {Promise}
   */
  addDataPoint (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/datapoint`, params
    )
  },

  /**
   * 更新数据端点
   * @param  {String} productId 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  updateDataPoint (productId, datapoint) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/datapoint/${datapoint.id}`, datapoint
    )
  },

  /**
   * 删除数据端点
   * @param  {String} productId 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  deleteDataPoint (productId, datapointId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/datapoint/${datapointId}`
    )
  },

  /**
   * 获取数据端点
   * @param  {String} productId 产品Id
   * @param  {Object} datapoint 数据端点
   * @return {Promise}
   */
  getDataPoint (productId, datapointId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/datapoint/${datapointId}`
    )
  },

  /**
   * 获取数据端点列表
   * @param  {String} productId 产品Id
   * @return {Promise}
   */
  getDatapoints (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/datapoints`
    )
  },

  /**
   * 获取设备的订阅信息
   * 获取订阅该设备的用户详细列表。
   * @param  {String} productId 产品Id
   * @return {Promise}
   */
  getUsers (productId, deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/subscribes`
    )
  },

  /**
   * 产品固件上传
   * @param  {String} productId  产品 ID
   * @param  {File} file        文件流数据
   * @return {Promise}
    {
      "url":"固件文件资源地址",
      "md5":"文件MD5值",
      "size":"文件大小"
    }
   */
  uploadFirmware (productId, file) {
    return http.upload(
      `${API_SERVER.default}/v2/upload/product/${productId}/firmware`, file
    )
  },

  /**
   * 获取虚拟设备数据
   * @param  {String} productId 产品Id
   * @param  {String} deviceId 虚拟设备 id
   * @return {Promise}
   */
  getVDevice (productId, deviceId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/v_device/${deviceId}`
    )
  },

  /**
   * 获取虚拟设备数据
   * @param  {String} productId 产品Id
   * @param  {Array} params 虚拟设备id数组
   * @return {Promise}
   */
  getVDevices (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/v_devices`, params
    )
  },

  getDevices (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/devices`, params
    )
  },
  // 通过csv批量导入设备
  // [{
  //      "mac":"mac地址",
  //      "sn":"序列号",
  //      "name":"名字"
  //   }]
  sendDevices (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device_import_batch`, params
    )
  },
  // 查询导入设备历史纪录
  getRecords (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device_import/records`, params
    )
  },
  // 查询导入设备记录详情
  getRecordInfo (productId, importId, limit, offset) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device_import/${importId}?limit=${limit}&offset=${offset}`
    )
  },

  // 查询导入设备记录详情
  updateDeviceMsg (productId, deviceId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}`, params
    )
  },

  // 获取用户管理个性化设置
  getProductField (productId) {
    return http.get(
      `${API_SERVER.default}/v2/customization?id=corp.${productId}.device.list`
    )
  },

  // 设置设备管理个性化设置
  setProductField (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/customization?id=corp.${productId}.device.list`, params
    )
  }
}
