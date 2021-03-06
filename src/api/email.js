import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 发送邮件验证码
   * 通过本接口向目标邮箱发送验证码进行验证邮箱有效性，邮箱验证码在发送后90秒有效。
   * @param  params
      {
       "email":"邮箱地址"
      }
   * @return status
   */
  getVerifycode (params) {
    return http.post(
      `${API_SERVER.default}/v2/email/verifycode`, params
    )
  },

  /**
   * 创建邮件模板
   * @return status
   */
  createTemplate (params) {
    return http.post(
      `${API_SERVER.default}/v2/email/template`, params
    )
  },

  /**
   * 修改邮件模板
   * @return status
   */
  updateTemplate (id, params) {
    return http.put(
      `${API_SERVER.default}/v2/email/template/${id}`, params
    )
  },

  /**
   * 获得邮件模板列表
   * @return status
   */
  getTemplateList () {
    return http.get(
      `${API_SERVER.default}/v2/email/template_list`
    )
  },

  /**
   * 获取邮件发送域名
   * @return status
   */
  getAddress () {
    return http.get(
      `${API_SERVER.default}/v2/corp/email_domain`
    )
  },

  /**
   * 设置邮件发送域名
   * @return status
   */
  setAddress (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/email_domain`, params
    )
  }
}
