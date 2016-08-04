import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 添加规则
   * @param  {Object} 告警规则参数
   * @return {Promise}
      {
        "id":"规则ID",
        "productId":"产品ID",
        "name":"规则名称",
        "content":"告警内容",
        "type":"告警规则类型",
        "notify_type":"通知类型",
        "notify_target":["1","2","3"],
        "is_enable":"是否启用",
        "param":"参数",
        "compare":"比较类型",
        "value":"比较值",
        "scope":"可见范围"
      }
   */
  addRule (params) {
    return http.post(
      `${API_SERVER.default}/v2/alert/rule`, params
    )
  },

  /**
   * 修改告警规则
   * @param  {String} 告警规则id
   * @param  {Object} 告警规则参数
   * @return {Promise}
   */
  updateRule (rule, productId) {
    var params = {
      product_id: productId,
      name: rule.name,
      content: rule.content,
      type: rule.type,
      notify_type: rule.notify_type,
      notify_apps: rule.notify_apps,
      notify_target: rule.notify_target,
      is_enable: rule.is_enable,
      param: rule.param,
      compare: rule.compare,
      value: rule.value,
      scope: rule.scope,
      tag: rule.tag
    }

    return http.put(
      `${API_SERVER.default}/v2/alert/rule/${rule.id}`, params
    )
  },

  /**
   * 删除告警规则
   * @param  {String} 告警规则id
   * @return {Promise}
   */
  deleteRule (ruleId) {
    return http.del(
      `${API_SERVER.default}/v2/alert/rule/${ruleId}`
    )
  },

  /**
   * 获取告警规则列表
   * @param  {String} 产品id
   * @return {Promise}
      [
        {
          "id":"规则ID",
          "name":"规则名称",
          "productId":"产品ID",
          "content":"告警内容",
          "type":"告警规则类型",
          "notify_type":"通知类型",
          "notify_target":["1","2","3"],
          "is_enable":"是否启用",
          "param":"参数",
          "compare":"比较类型",
          "value":"比较值",
          "scope":"可见范围"
        }
      ]
   */
  getRules (productId) {
    return http.get(
      `${API_SERVER.default}/v2/alert/rules?product_id=${productId}`
    )
  },

  /**
   * 获取消息列表
   * @param  {Object} params 查询条件
   * @return {Promise} 告警消息列表
     {
       "count":"总数量",
       "list":
         [
           {
             "id":"消息标识ID",
             "type":"消息类型"
             "product_name":"产品名称",
             "alert_name":"规则名称",
             "alert_value":"告警状态值",
             "notify_type":"通知类型",
             "from":"消息发送者",
             "to":"消息接受者",
             "content":"消息实体",
             "create_date":"创建时间",
             "is_read":"是否已读",
             "tags":"标签"
           }
         ]
       }
   */
  getAlerts (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/messages`, params
    )
  },

  /**
   * 设置消息为已读状态
   * @param {Array} params 消息列表
   */
  setAlertRead (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/message_read`, params
    )
  },
  /**
   * 设置消息为未读状态
   * @param {Array} params 消息列表
   */
  setAlertUnread (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/message_unread`, params
    )
  },
  /**
   * 告警消息产品下标签小时趋势
   * @param {Array} params 消息列表
   */
  getTagTrend (productId, tag, startDay, endDay, startHour, endHour) {
    startHour = startHour || '00'
    endHour = endHour || '00'
    return http.get(
      `${API_SERVER.default}/v2/statistics/message/trend_hour_tag?product_id=${productId}&tag=${tag}&start_day=${startDay}&start_hour=${startHour}&end_day=${endDay}&end_hour=${endHour}`
    )
  },
  /**
   * 告警消息产品下按标签下告警规则小时趋势
   * @param {Array} params 消息列表
   */
  getTagRuleTrend (productId, tag, ruleId, startDay, endDay, startHour, endHour) {
    startHour = startHour || '00'
    endHour = endHour || '00'
    return http.get(
      `${API_SERVER.default}/v2/statistics/message/trend_hour_tag_rule?product_id=${productId}&tag=${tag}&rule=${ruleId}&start_day=${startDay}&start_hour=${startHour}&end=${endDay}&end_hour=${endHour}`
    )
  }
}
