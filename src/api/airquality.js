import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  token (appId) {
    let pluginsToken = JSON.parse(window.localStorage.pluginsToken)
    return pluginsToken[appId] && pluginsToken[appId].token || ''
  },
  /**
   * 获取环境数据列表
   * @param  {string} appId  企业id
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getAirQualitys (appId, params) {
    // this.token(appId)
    return http.post(
      `${API_SERVER.airquality}/${appId}/api/airQuality/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': this.token(appId)
        }
      }
    )
  }
}
