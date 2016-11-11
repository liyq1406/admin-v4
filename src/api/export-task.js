import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 创建导出CSV任务
   * @param {Object} params 任务参数
   */
  createTask (params) {
    return http.post(
      `${API_SERVER.default}/v2/export_task`, params
    )
  },

  /**
   * 获取单个导出任务
   * @param {String} id 任务id
   */
  getTask (id) {
    return http.get(
      `${API_SERVER.default}/v2/export_task/${id}`
    )
  },

  /**
   * 获取导出任务授权链接
   * @param {String} id 任务id
   */
  getTaskUrl (id) {
    return http.get(
      `${API_SERVER.default}/v2/export_task/${id}/auth_link`
    )
  },

  /**
   * 创建导出CSV任务
   * @param {Object} params 任务参数
   */
  getTasks (params) {
    return http.post(
      `${API_SERVER.default}/v2/export_tasks`, params
    )
  }
}
