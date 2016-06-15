import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 创建数据表
   * @param  {Object} params 数据表参数
   */
  createTable (params) {
    return http.post(
      `${API_SERVER.default}/v2/table`, params
    )
  },

  /**
   * 修改数据表
   * @param  {Object} table 数据表
   */
  updateTable (table) {
    var params = {}

    params.type = table.type
    params.permission = table.permission
    params.field = table.field

    return http.put(
      `${API_SERVER.default}/v2/table/${table.name}`, params
    )
  },

  /**
   * 获取单个数据表
   */
  getTable (tableName) {
    return http.get(
      `${API_SERVER.default}/v2/table/${tableName}`
    )
  },

  /**
   * 获取数据表列表
   */
  getTables () {
    return http.get(
      `${API_SERVER.default}/v2/tables`
    )
  },

  /**
   * 删除数据表
   * @param  {String} tableName 表名
   */
  deleteTable (tableName) {
    return http.del(
      `${API_SERVER.default}/v2/table/${tableName}`
    )
  },

  /**
   * 创建数据
   * @param  {Object} params 数据参数
   */
  createData (tableName, params) {
    return http.post(
      `${API_SERVER.default}/v2/data/${tableName}`, params
    )
  },

  /**
   * 创建应用级数据
   * @param  {Object} params 数据参数
   */
  createAppData (tableName, params) {
    return http.post(
      `${API_SERVER.default}/v2/app_data/${tableName}`, params
    )
  },

  /**
   * 获取单条数据
   * @param  {String} tableName 表名
   * @param  {String} objectId 数据 id
   */
  getData (tableName, objectId) {
    return http.get(
      `${API_SERVER.default}/v2/data/${tableName}/${objectId}`
    )
  },

  /**
   * 查询数据
   * @param  {String} tableName 表名
   * @param  {Object} params 数据参数
   */
  queryData (tableName, params) {
    return http.post(
      `${API_SERVER.default}/v2/datas/${tableName}`, params
    )
  },

  /**
   * 查询应用级数据
   * @param  {String} tableName 表名
   * @param  {Object} params 数据参数
   */
  queryAppData (tableName, params) {
    return http.post(
      `${API_SERVER.default}/v2/app_datas/${tableName}`, params
    )
  },

  /**
   * 修改数据
   * @param  {String} tableName 表名
   * @param  {String} objectId 数据 id
   * @param  {Object} params 数据参数
   */
  updateData (tableName, objectId, params) {
    return http.put(
      `${API_SERVER.default}/v2/data/${tableName}/${objectId}`, params
    )
  },

  /**
   * 修改应用级数据
   * @param  {String} tableName 表名
   * @param  {String} objectId 数据 id
   * @param  {Object} params 数据参数
   */
  updateAppData (tableName, _id, params) {
    return http.put(
      `${API_SERVER.default}/v2/app_data/${tableName}/${_id}`, params
    )
  },

  /**
   * 删除数据
   * @param  {String} tableName 表名
   * @param  {String} objectId 数据 id
   */
  deleteData (tableName, objectId) {
    return http.del(
      `${API_SERVER.default}/v2/data/${tableName}/${objectId}`
    )
  },

  /**
   * 删除应用级数据
   * @param  {String} tableName 表名
   * @param  {String} objectId 数据 id
   */
  deleteAppData (tableName, _id) {
    return http.del(
      `${API_SERVER.default}/v2/app_data/${tableName}/${_id}`
    )
  }
}
