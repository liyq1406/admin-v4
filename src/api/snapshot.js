import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 用户获取设备快照
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  getSnapshot (product_id, device_id, params) {
    return http.post(
      `${apiServer.default}/v2/product/${product_id}/device/${device_id}/snapshot`, params
    )
  }
}
