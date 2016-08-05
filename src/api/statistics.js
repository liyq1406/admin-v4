import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 获取汇总摘要信息
   * @return {Object} 返回产品摘要
   *  {
        "device":
        {
          "activated":"设备总激活数",
          "total":"设备总数",
          "online":"设备在线数量"
        },
        "user":
        {
          "total":"用户总数"
        }
      }
   */
  getSummary () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/summary`
    )
  },

  /**
   * 获取产品摘要信息
   * @return {Object} 返回产品摘要
   *  {
        "total":"总设备量",
        "activated":"激活总数",
        "online":"设备在线数",
        "send_times":"发送指令次数",
        "send_bytes":"发送指令总字节数",
        "recv_times":"接收指令次数",
        "recv_bytes":"接收指令总字节数"
      }
   */
  getProductSummary (productId) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/summary`
    )
  },

  /**
   * 获取产品趋势信息
   * @return {Object} 返回产品趋势
   *  [
        {
          "day":"日期，如2015-12-10",
          "activated":"激活设备量",
          "active":"活跃设备量"
          "send_times":"发送指令次数",
          "send_bytes":"发送数据总数",
          "recv_times":"接收指令次数",
          "recv_bytes":"接收数据总数"
        }
      ]
   */
  getProductTrend (productId, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/trend?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 获取用户摘要信息
   * @return {Object} 返回用户摘要
   *  {
        "total":"总用户数",
        "online":"在线数",
        "send_times":"发送指令次数",
        "send_bytes":"发送指令总字节数",
        "recv_times":"接收指令次数",
        "recv_bytes":"接收指令总字节数"
      }
   */
  getUserSummary () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user/summary`
    )
  },

  /**
   * 获取用户趋势信息
   * @return {Object} 返回用户趋势
   *  [
        {
          "day":"日期，如2015-12-10",
          "add":"新增用户数",
          "active":"活跃用户数",
          "send_times":"发送指令次数",
          "send_bytes":"发送数据总数",
          "recv_times":"接收指令次数",
          "recv_bytes":"接收数据总数"
        }
      ]
   */
  getUserTrend (startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user/trend?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 获取产品区域分布
   * @param {String} productId 产品id
   * @return {Object} 返回产品区域分布
   *  {
       "China":
        {
          "guangdong":
          {
            "activated":4,
            "shenzhen":
            {
              "activated":4
            }
          },
          "activated":4
        }
      }
   */
  getProductRegion (productId) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/region`
    )
  },

  /**
   * 获取用户区域分布
   * @return {Object} 返回用户区域分布
   *  {
       "China":
        {
          "register":4,
          "guangdong":
          {
            "register":4,
            "shenzhen":
            {
              "register":4
            }
          }
        }
      }
   */
  getUserRegion () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user/region`
    )
  },

  /**
   * 消息统计概览
   * @param  {String} startDay 开始日期
   * @param  {String} endDay   结束日期
   * @return {Promise}
   */
  getAlertSummary (startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/message/summary?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 消息日趋势
   * @param  {String} startDay 开始日期
   * @param  {String} endDay   结束日期
   * @return {Promise}
   */
  getAlertTrend (startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/message/trend?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 获取大客户统计概览
   * @param  {[type]} startDay [description]
   * @param  {[type]} endDay   [description]
   * @return {[type]}          [description]
   */
  getHeavyBugerSummary () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/heavy_buger/summary`
    )
  },

  /**
   * 获取大客户统计日趋势
   * @param  {[type]} startDay [description]
   * @param  {[type]} endDay   [description]
   * @return {[type]}          [description]
   */
  getHeavyBugerTrend (startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/heavy_buger/trend?start_day=${startDay}&end_day=${endDay}`
    )
  }
}
