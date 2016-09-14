import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  refreshToken () {
    return http.post(
      `${API_SERVER.default}/v2/corp/token/refresh`, {
        'refresh_token': window.localStorage.getItem('refreshToken')
      }
    )
  },
  /**
   * 企业帐号注册
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  register (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp_register`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 企业成员登录认证
   * 注册成为企业用户后，通过企业账号认证登录获得RESTful调用凭证，通过调用凭证可调用企业信息管理接口
   * @param  {Object} params 登录信息
      {
        'account': '手机号/邮箱地址',
        'password': '登陆密码'
      }
   * @return {Promise}
      {
        'corp_id': '企业ID',
        'member_id': '成员ID',
        'access_token': '调用凭证',
        'refresh_token': '刷新凭证',
        'expire_in': '有效期（秒）'
      }
   */
  auth (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp_auth`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 重置密码
   * @param  {Object} params 重置密码参数信息
   * @return {Promise}
   */
  resetPassword (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/password/forgot`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 发起成员邀请邮件
   * 管理员可发起成员邀请，发起后向成员邮箱发送邮件并提供链接，成员通过该链接完善登陆信息。
   * @param  {Object} params  { "email":"成员邮箱地址", "content":"邮件内容","role":"角色类型"}
   * @return {Promise}
   */
  memberInvite (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/member_invite`, params
    )
  },

  /**
   * 成员激活邀请
   * 通过本接口完善成员登陆信息后完成激活，这时成员的邮箱是已认证。
   * @param  {Object} params  {"phone":"手机号码", "verifycode":"手机验证码","name":"您的姓名","email":"邮箱地址","password":"登陆密码"}
   * @return {Promise}
   */
  memberActivate (params) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member_activate`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 获取单个成员信息
   * 获取一个成员的基本信息。。
   * @param  {Object} params  {member_id}
   * @return {Promise}   {  "id":"成员ID", "name":"姓名", "role":"角色类型", "status":"成员状态" }
   */
  getMember (id) {
    return http.get(
      `${API_SERVER.default}/v2/corp/member/${id}`
    )
  },

  /**
   * 获取帐号下所有成员列表
   * @param  {Object} params query参数
   * @return {Promise}
   */
  getMembers (condition) {
    var offset = condition.offset || 0
    var limit = condition.limit || 10
    return http.get(
      `${API_SERVER.default}/v2/corp/members?offset=${offset}&limit=${limit}`
    )
  },

  /**
   * 删除单个成员信息
   * 删除一个成员的基本信息
   * @param  {Object} params  {member_id}
   * @return  stauts
   */
  delMember (id) {
    return http.del(
      `${API_SERVER.default}/v2/corp/member/${id}`
    )
  },

  /**
   * 编辑成员基本信息
   * 成员编辑本成员的基本信息。
   * @param  {Object} params  {"name":"成员姓名"}
   * @param  {member_id}
   * @return  stauts
   */
  updateMember (id, params) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member/${id}`, params
    )
  },

  setMemberRole (id, roleType, params) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member/${id}/role/${roleType}`, params
    )
  },
  /**
   * 成员重置密码
   * 成员重置自己的密码，成员只能重置自己的密码，管理员不能修改其他任何成员的密码。
   * @param  {Object} params  { "oldpassword":"旧密码",  "newpassword":"新密码"}
   * @return  stauts
   */
  memberResetPwd (params) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member/password/reset`, params
    )
  },

  /**
   * 企业帐号邮箱注册
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  emailRegister (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp_register_email`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 企业帐号邮箱激活
   * @param  {Object} params 激活参数
   * @return {Promise}
   */
  emailActivate (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/email_activate`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 用户帐号邮箱激活
   * @param  {Object} params 激活参数
   * @return {Promise}
   */
  userEmailActivate (params) {
    return http.post(
      `${API_SERVER.default}/v2/user_email_activate`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 发起企业邮箱密码重置
   * @param  {Object} params 重置参数
   */
  fetchPasswordByMail (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/password/forgot/email`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 企业邮箱重置密码
   * @param  {[type]} params 重置参数
   */
  resetPasswordByMail (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/password/reset/email`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 用户邮箱重置密码
   * @param  {[type]} params 重置参数
   */
  resetUserPasswordByMail (params) {
    return http.post(
      `${API_SERVER.default}/v2/user/password/foundback`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 验证找回密码邮件链接是否过期
   * @param  {[type]} params 参数
   */
  validVerifycode (params) {
    return http.post(
      `${API_SERVER.default}/v2/user/password/valid_verifycode`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 获取url,token信息
   * @param
   * @return
   */
  getUserSetting () {
    return http.get(
      `${API_SERVER.default}/v2/corp_setting`
    )
  },

  /**
   * 更新url,token信息
   * @param
   *  @return
   */
  updateUserSetting (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp_setting`, params
    )
  },

  /**
   * 获取企业信息
   * @param  {Object} params  {corp_id}
   * @return {Promise}   {  "id":"企业ID", "company":"企业名称", "create_time":"创建时间", "type":"企业应用类型" ,"member":{"id":"成员ID","phone":"手机I号码","email":"邮箱地址","name":"姓名" }}
   */
  getCorpInfo () {
    return http.get(
      `${API_SERVER.default}/v2/corp`
    )
  },
  /**
   * 获取授权配额
   * @param  {Object} params 重置密码参数信息
   * @return {Promise}
   */
  getLimit (params) {
    return http.post(
      `${API_SERVER.default}/v2/corp/password/forgot`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },
  /**
   * 停用成员
   * @param  {string} memberId 成员id
   * @return {Promise}
   */
  disableMember (memberId) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member/${memberId}/disable`
    )
  },

  /**
   * 启用成员
   * @param  {string} memberId 成员id
   * @return {Promise}
   */
  enableMember (memberId) {
    return http.put(
      `${API_SERVER.default}/v2/corp/member/${memberId}/enable`
    )
  }

}
