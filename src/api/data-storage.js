import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 创建数据表
   * @param  {ObjectTable} params 创建数据表信息
      {
        "filed":
            [
                {"filed1":"数据类型"},
                {"filed2":"数据类型"}
            ],
        "permission":
            {
                "owner":["read","update","delete"],
                "user":["insert","read","update","delete"]
            }
    }
   * @return status
   */
  create (params, objectTable) {
    return http.post(
      `${apiServer.default}/v2/data/create/${objectTable}`, params
    )
  },

  /**
   * 新增数据
   * @param  {ObjectTable} params
    {
      "字段A":"字段A的值",
      "字段B":"字段B的值"
    }
   * @return {Promise}
    {
        "objectId":"数据ID",
        "createAt":"创建时间",
        "updateAt":"更新时间",
        "字段A":"字段A的值",
        "字段B":"字段B的值",
        "creator":"创建者"
    }
   */
  addData (params, objectTable) {
    return http.post(
      `${apiServer.default}/v2/data/${objectTable}`, params
    )
  },

  /**
   * 获取数据
   * @param  {ObjectTable} {objectId} params 查询数据表信息
   * @return {Promise}
     {
        "objectId":"数据ID",
        "createAt":"创建时间",
        "updateAt":"更新时间",
        "字段A":"字段A的值",
        "字段B":"字段B的值",
        "creator":"创建者"
    }
   */
  getData (objectTable, objectId) {
    return http.get(
      `${apiServer.default}/v2/data/${objectTable}/${objectId}`
    )
  },

  /**
   * 查询数据
   * @param  {ObjectTable} params 创建数据表信息
    {
      "offset":"请求列表的偏移量",
      "limit":"请求数量",
      "filter":["字段A","字段B"],
      "query":
        {
          "filed1":{"$in":["字段值","字段值"]},
          "filed3":{"$lt":"字段值"}
        },
      "order":
        {
          "filed1":"desc",
          "filed2":"asc"
        }
    }
   * @return {Promise}
    {
      "count":"返回的对象数量",
      "list":
        [
          {
            "objectId":"对象ID",
            "createAt":"创建时间",
            "updateAt":"更新时间",
            "字段A":"字段A的值",
            "字段B":"字段B的值",
            "creator":"创建者"
          }
        ]
    }
   */
  dataList (params, objectTable) {
    return http.post(
      `${apiServer.default}/v2/data/${objectTable}/list`, params
    )
  },

  /**
   * 修改数据
   * @param  {ObjectTable} {objectId} params 修改数据表信息
     {
        "字段A":"字段A的值",
        "字段B":"字段B的值"
    }
   * @return {Promise}
     {
        "objectId":"对象ID",
        "createAt":"创建时间",
        "updateAt":"更新时间",
        "字段A":"字段A的值",
        "字段B":"字段B的值",
        "creator":"创建者"
    }
   */
  alertData (params, objectTable, objectId) {
    return http.put(
      `${apiServer.default}/v2/data/${objectTable}/${objectId}`, params
    )
  },

  /**
   * 删除XLink平台数据
   * @param  {ObjectTable} {objectId} params 删除XLink平台数据表信息
   * @return {Promise}
   */
  delAllData (objectTable, objectId) {
    return http.del(
      `${apiServer.default}/v2/data/${objectTable}/${objectId}`
    )
  }
}
