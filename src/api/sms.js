import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 向目标手机发送短信验证码
   * @param  {Object} params 传递参数
   * @example
   *   api.sms.getVerifycode({phone: '13800138000'})
   */
  getVerifycode (params) {
    return http.post(
      `${API_SERVER.default}/v2/sms/verifycode`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
