import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 自定义运营帐号列表获取
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getList (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_list`, params
    )
  },
  /**
   * 自定义运营帐号添加
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  addCount (params) {
    // console.log(JSON.stringify(params))
    return http.post(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_add`, params
    )
  },
  /**
   * 自定义运营帐号单个查询
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getCount (accountId) {
    return http.get(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_query/${accountId}`
    )
  },
  /**
   * 自定义运营帐号编辑
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  editCount (accountId, params) {
    return http.put(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_modify/${accountId}`, params
    )
  },
  /**
   * 自定义运营帐号删除
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  delCount (accountId) {
    return http.del(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_delete/${accountId}`
    )
  },

  /**
   * 邮件账户添加
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  addEmailAcount (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/email/email_account`, params
    )
  },
  /**
   * 邮件账户查询
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getEmailAcount () {
    return http.get(
      `${API_SERVER.message}/v2/message/email/email_account`
    )
  },
  /**
   * 邮件账户修改
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  editEmailAcount (params) {
    return http.put(
      `${API_SERVER.message}/v2/message/email/email_account`, params
    )
  },
  /**
   * 邮件账户删除
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  delEmailAcount () {
    return http.del(
      `${API_SERVER.message}/v2/message/email/email_account`
    )
  },
  /**
   * 设置发送短信默认帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setMessageAcount (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/sms/default_account_type`, params
    )
  },
  /**
   * 查询发送短信默认帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getMessageAcount () {
    return http.get(
      `${API_SERVER.message}/v2/message/sms/default_account_type`
    )
  },
  /**
   * 设置自定义运营商默认帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setCustomAcount (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_default_account`, params
    )
  },
  /**
   * 增加第三方厂商帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  addThirdAcount (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/sms/third_party_account`, params
    )
  },
  /**
   * 查询第三方厂商帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getThirdAcount () {
    return http.get(
      `${API_SERVER.message}/v2/message/sms/third_party_account`
    )
  },
  /**
   * 修改第三方厂商帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  editThirdAcount () {
    return http.put(
      `${API_SERVER.message}/v2/message/sms/third_party_account`
    )
  },
  /**
   * 删除第三方厂商帐号
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  delThirdAcount () {
    return http.put(
      `${API_SERVER.message}/v2/message/sms/third_party_account`
    )
  },
  /**
   * 获取图形验证码状态
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getCaptcha () {
    return http.get(
      `${API_SERVER.default}/v2/message/sms/captcha_setting`
    )
  },
  /**
   * 获取图形验证码状态
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  setCaptcha (params) {
    return http.post(
      `${API_SERVER.default}/v2/message/sms/captcha_setting`, params
    )
  }
}
