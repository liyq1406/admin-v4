import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  // 新建任务
  addTask (params) {
    return http.post(
      `${API_SERVER.default}/v2/broadcast/task_add`, params
    )
  },
  // 更新任务
  updateTask (taskId, params) {
    return http.put(
      `${API_SERVER.default}/v2/broadcast/task/${taskId}`, params
    )
  },
  // 删除任务
  deleteTask (taskId) {
    return http.del(
      `${API_SERVER.default}/v2/broadcast/task/${taskId}`
    )
  },
  // 获取任务列表
  getTasks (params) {
    return http.post(
      `${API_SERVER.default}/v2/broadcast/tasks`, params
    )
  },
  // 获取单个消息推送任务详情
  getTask (id) {
    return http.get(
      `${API_SERVER.default}/v2/broadcast/task/${id}`
    )
  },
  // 获取消息推送人数
  getNumOfPeople (params) {
    return http.post(
      `${API_SERVER.default}/v2/broadcast/task_user`, params
    )
  },

  // 获取消息推送任务用户列表
  getUserList (params) {
    return http.get(
      `${API_SERVER.default}/v2/broadcast/get_users`, params
    )
  }
}
