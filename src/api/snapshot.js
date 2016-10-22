import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 用户获取设备快照
   * @param  {String} productId 产品ID
   * @param  {String} deviceId  设备ID
   * @param  {Object} params    参数
   * @return {Promise}
   */
  getSnapshot (productId, deviceId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/device/${deviceId}/snapshot`, params
    )
  },

  /**
   * 创建产品快照规则
   * @param  {String} productId 产品ID
   * @param  {Object} params    规则参数
   * @return {Promise}
   */
  createRule (productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },

  /**
   * 获取产品快照规则列表
   * @param  {String} productId 产品ID
   * @return {Promise}
   */
  getRules (productId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshots`
    )
  },

  /**
   * 获取指定产品快照规则
   * @param  {String} productId 产品ID
   * @param  {String} ruleId    规则ID
   * @return {Promise}
   */
  getRule (productId, ruleId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${ruleId}`
    )
  },

  /**
   * 修改产品快照规则
   * @param  {String} productId 产品ID
   * @param  {Object} params    规则参数
   * @return {Promise}
   */
  updateRule (productId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/snapshot`, params
    )
  },

  /**
   * 删除产品快照规则
   * @param  {String} productId 产品ID
   * @param  {String} ruleId    规则ID
   * @return {Promise}
   */
  deleteRule (productId, ruleId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${ruleId}`
    )
  },
  /**
   * 获取产品下快照统计规则列表
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @return {Promise}
   */
  getAllStatisticRules (params) {
    return http.post(
      `${API_SERVER.default}/v2/snapshot/statistics_rules`, params
    )
  },
  /**
   * 获取产品下快照统计规则列表
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @return {Promise}
   */
  getStatisticRules (productId, snapshotId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${snapshotId}/statistic_rules`
    )
  },
  /**
   * 获取单个快照统计规则
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @param  {String} statisticRuleId 统计规则ID
   * @return {Promise}
   */
  getSingleStatisticRule (productId, snapshotId, statisticRuleId) {
    return http.get(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${snapshotId}/statistic_rule/${statisticRuleId}`
    )
  },
  /**
   * 创建快照统计规则
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @param  {Object} params 携带参数
   * @return {Promise}
   */
  ceateStatisticRules (productId, snapshotId, params) {
    return http.post(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${snapshotId}/statistic_rule`, params
    )
  },
  /**
   * 修改快照统计规则
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @param  {String} statisticRuleId 统计规则ID
   * @param  {Object} params 携带参数
   * @return {Promise}
   */
  editStatisticRule (productId, snapshotId, statisticRuleId, params) {
    return http.put(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${snapshotId}/statistic_rule/${statisticRuleId}`, params
    )
  },
  /**
   * 删除快照统计规则
   * @param  {String} productId 产品ID
   * @param  {String} snapshotId 快照规则ID
   * @param  {String} statisticRuleId 统计规则ID
   * @return {Promise}
   */
  delStatisticRules (productId, snapshotId, statisticRuleId) {
    return http.del(
      `${API_SERVER.default}/v2/product/${productId}/snapshot/${snapshotId}/statistic_rule/${statisticRuleId}`
    )
  }
}
