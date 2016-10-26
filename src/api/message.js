import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 自定义运营账号列表获取
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getList (params) {
    return http.post(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_list`, params
    )
  },
  /**
   * 自定义运营账号添加
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
   * 自定义运营账号单个查询
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  getCount (accountId) {
    return http.get(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_query/${accountId}`
    )
  },
  /**
   * 自定义运营账号编辑
   * @param  {[type]} params 参数
   * @return {[type]}        [description]
   */
  editCount (accountId, params) {
    return http.put(
      `${API_SERVER.message}/v2/message/sms/custom_carrier_account_modify/${accountId}`, params
    )
  },
  /**
   * 自定义运营账号删除
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
  }
}