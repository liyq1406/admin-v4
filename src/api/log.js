import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 查询企业成员的行为记录
   */
  memberActions (params) {
    return http.post(
      `${API_SERVER.default}/v2/log/member_action`, params
    )
  }
}
