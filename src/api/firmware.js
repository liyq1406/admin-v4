import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 创建自动升级任务
   * 创建一个固件升级任务，让满足该升级任务的设备进行自动升级。
   * @param  params
     {
        "product_id":"产品ID",
        "name":"升级任务名称",
        "description":"描述",
        "from_version":"起始版本号",
        "from_version_url":"起始版本文件地址",
        "target_version":"目标版本号",
        "target_version_url":"目标版本文件地址"
      }
   * @return {Promise}
      {
        "id":"自动升级任务ID",
        "product_id":"产品ID",
        "name":"升级任务名称",
        "description":"描述",
        "from_version":"起始版本号",
        "from_version_url":"起始版本文件地址",
        "target_version":"目标版本号",
        "target_version_url":"目标版本文件地址",
        "upgrade_count":"已升级设备数量",
        "status":"任务状态"
      }
   */
  task (params) {
    return http.post(
      `${apiServer.default}/v2/upgrade/firmware/task`, params
    )
  },

  /**
   * 获取升级任务列表
   * @param  product_id
   * @return {Promise}
    [
      {
        "id":"自动升级任务ID",
        "product_id":"产品ID",
        "name":"升级任务名称",
        "description":"描述",
        "from_version":"起始版本号",
        "from_version_url":"起始版本文件地址",
        "target_version":"目标版本号",
        "target_version_url":"目标版本文件地址",
        "upgrade_count":"已升级设备数量",
        "status":"任务状态"
      }
    ]
   */
  taskList (product_id) {
    return http.get(
      `${apiServer.default}/v2/upgrade/firmware/tasks?product_id=${product_id}`
    )
  },

  /**
   * 3.开始和停止自动升级任务
   * 开启一个升级任务。
   * @param  {Object} params
      {
        "product_id":"产品ID",
        "upgrade_task_id":"升级任务ID",
        "status":"任务状态"
      }
   * @return status
   */
  toggleTaskStatus (params) {
    return http.post(
      `${apiServer.default}/v2/upgrade/firmware/task/status`, params
    )
  },

  /**
   * 用户查询设备固件最新版本
   * 查看设备当前的固件最新版本。
   * @param  {Object} params 注册信息
      {
        "product_id":"产品ID",
        "device_id":"设备ID"
      }
   * @return {Promise}
      {
        "current":"当前设备的固件版本",
        "newest":"可升级的固件版本",
        "description":"升级描述"
      }
    */
  newestVersion (params) {
    return http.post(
      `${apiServer.default}/v2/upgrade/device/newest_version`, params
    )
  },

  /**
   * 删除升级任务
   *
   * @param
   * @return
    */
  removeTask (params) {
    return http.post(
      `${apiServer.default}/v2/upgrade/firmware/task/delete`, params
    )
  },

  /**
   * 5.用户手动升级设备
   * 通过本接口升级设备固件。
   * @param  {Object} params 注册信息
      {
        "product_id":"产品ID",
        "device_id":"设备ID"
      }
   * @return status
   */
  upgrade (params) {
    return http.post(
      `${apiServer.default}/v2/upgrade/device`, params
    )
  }
}
