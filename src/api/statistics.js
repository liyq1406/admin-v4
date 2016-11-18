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
   * 消息产品下统计概览
    * @param  {String} productId 产品id
   * @param  {String} startDay 开始日期
   * @param  {String} endDay   结束日期
   * @return {Promise}
   */
  getProductAlertSummary (productId, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/message/product_summary?product_id=${productId}&start_day=${startDay}&end_day=${endDay}`
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
  },

  /**
   * 产品下设备单次使用时长统计
   * @param  {String} productId 产品 ID
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getActionDuration (productId, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/action_duration?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 产品下设备使用次数统计
   * @param  {String} productId 产品 ID
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getActionTimes (productId, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/action_times?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 产品下设备单次使用时长统计
   * @param  {String} productId 产品 ID
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getActionPeriod (productId, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/product/${productId}/action_period?start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 推送任务阅读数日趋势
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getReadTrend (id, startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/broadcast/read_trend?id=${id}&start_day=${startDay}&end_day=${endDay}`
    )
  },

  /**
   * 统计企业下的用户男女数量
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getUserSex () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user_sex`
    )
  },

  /**
   * 统计企业下特定年龄段的用户数量
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getUserAge (minAge, maxAge) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user_age?minage=${minAge}&maxage=${maxAge}`
    )
  },

  /**
   * 统计企业下的用户语言数量
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getUserLanguage () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user_language`
    )
  },

  /**
   * 统计企业下的用户的终端系统分布
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getUserOs () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user_os`
    )
  },

  /**
   * 统计企业下的用户的机型分布
   * @param  {String} productId 推送任务id
   * @param  {String} startDay  开始日期
   * @param  {String} endDay    结束日期
   * @return {Promise}
   */
  getUserMachine () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/user_machine`
    )
  },

  /**
   * 设备快照数据端点统计
   * @param  {String} snapshotId 快照id
   * @param  {String} statisticsId  统计id
   * @param  {String} deviceId    设备id
   * @param  {Object} params  查询参数
   * @return {Promise}
   */
  getSnapshotStatistic (snapshotId, statisticsId, deviceId, params) {
    return http.post(
      `${API_SERVER.default}/v2/statistics/snapshot/${snapshotId}/snapshot_statistic/${statisticsId}/${deviceId}`, params
    )
  },
  /**
   * 依照统计规则产品维度数据端点统计
   * @param  {String} snapshotId 快照id
   * @param  {String} statisticsId  统计id
   * @param  {Object} params  查询参数
   * @return {Promise}
   */
  getProductSnapshotStatistic (snapshotId, statisticsId, params) {
    return http.post(
      `${API_SERVER.default}/v2/statistics/product_snapshot/${snapshotId}/snapshot_datapoint/${statisticsId}`, params
    )
  },
  /**
   * 经销商销售信息日趋势统计
   * @param  {String} startDay 查询开始时间 yyyy-mm-dd
   * @param  {String} endDay  查询结束时间 yyyy-mm-dd
   * @return {Promise}
   */
  getDealerSaleTrend (startDay, endDay) {
    return http.get(
      `${API_SERVER.default}/v2/statistics/dealer/sale_trend?start_day=${startDay}&end_day=${endDay}`
    )
  },
  /**
   * 经销商区域分布
   * @return {Promise}
   */
  getDealeSaleRegion () {
    return http.get(
      `${API_SERVER.default}/v2/statistics/dealer/sale_region`
    )
  }
}
