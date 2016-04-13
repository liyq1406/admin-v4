import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 创建数据表
   * @param  {Object} params 数据表参数
   */
  createTable (params) {
    return http.post(
      `${apiServer.default}/v2/table`, params
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
      `${apiServer.default}/v2/table/${table.name}`, params
    )
  },

  /**
   * 获取单个数据表
   */
  getTable (table_name) {
    return http.get(
      `${apiServer.default}/v2/table/${table_name}`
    )
  },

  /**
   * 获取数据表列表
   */
  getTables () {
    return http.get(
      `${apiServer.default}/v2/tables`
    )
  },

  /**
   * 删除数据表
   * @param  {String} table_name 表名
   */
  deleteTable (table_name) {
    return http.del(
      `${apiServer.default}/v2/table/${table_name}`
    )
  },

  /**
   * 创建数据
   * @param  {Object} params 数据参数
   */
  createData (table_name, params) {
    return http.post(
      `${apiServer.default}/v2/data/${table_name}`, params
    )
  },

  /**
   * 获取单条数据
   * @param  {String} table_name 表名
   * @param  {String} object_id 数据 id
   */
  getData (table_name, object_id) {
    return http.get(
      `${apiServer.default}/v2/data/${table_name}/${object_id}`
    )
  },

  /**
   * 查询数据
   * @param  {String} table_name 表名
   * @param  {Object} params 数据参数
   */
  queryData (table_name, params) {
    return http.post(
      `${apiServer.default}/v2/datas/${table_name}`, params
    )
  },

  /**
   * 修改数据
   * @param  {String} table_name 表名
   * @param  {String} object_id 数据 id
   * @param  {Object} params 数据参数
   */
  updateData (table_name, object_id, params) {
    return http.put(
      `${apiServer.default}/v2/data/${table_name}/${object_id}`, params
    )
  },

  /**
   * 删除数据
   * @param  {String} table_name 表名
   * @param  {String} object_id 数据 id
   */
  deleteData (table_name, object_id) {
    return http.del(
      `${apiServer.default}/v2/data/${table_name}/${object_id}`
    )
  }
}
