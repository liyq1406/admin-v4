import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  // 新建任务
  addTask (params) {
    return http.post(
      `${API_SERVER.default}/v2/broadcast/task_add`, params
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
      `${API_SERVER.default}/v2/broadcast/tasks/${id}`
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
