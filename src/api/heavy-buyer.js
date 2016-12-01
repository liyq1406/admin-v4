import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 大客户登录认证
   */
  auth (params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer_auth`, params
    )
  },

  /**
   * 添加大客户
   * @param {[type]} params [description]
   */
  //  {
  //    "name":"大客户名称",
  //    "email":"邮箱地址",
  //    "phone":"手机",
  //    "password":"登录密码",
  //    "industry":"行业",
  //    "location":"地址",
  //    "contacter":"联系人",
  //    "contact_way":"联系方式"
  //  }
  addHeavyBuyer (params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer`, params
    )
  },

  /**
   * 编辑大客户
   */
  editHeavyBuyer (id, params) {
    return http.put(
      `${API_SERVER.default}/v2/heavy_buyer/${id}`, params
    )
  },

  // 启用停用大客户
  setHeavyBuyerStatus (id, status) {
    return http.put(
      `${API_SERVER.default}/v2/heavy_buyer/${id}/status/${status}`
    )
  },

  /**
   * 删除大客户
   */
  delHeavyBuyer (id) {
    return http.del(
      `${API_SERVER.default}/v2/heavy_buyer/${id}`
    )
  },

  /**
   * 获取大客户列表
   */
  getHeavyBuyer (params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer_list`, params
    )
  },

  /**
   * 获取组织列表
   */
  getOrganizationList (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/organization_list`, params
    )
  },

  /**
   * 添加一个组织
   */
  addOrganization (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/organization`, params
    )
  },

  /**
   * 批量修改组织
   */
  updateOrganizations (heavyBuyerId, params) {
    return http.put(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/organization_list`, params
    )
  },

  /**
   * 删除组织
   */
  deleteOrganization (heavyBuyerId, organizationId) {
    return http.del(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/organization/${organizationId}`
    )
  },

  /**
   * 组织用户列表
   */
  getOrganizationUsers (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/user_list`, params
    )
  },

  /**
   * 创建组织下用户
   */
  createUser (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/user`, params
    )
  },
  /**
   * 修改组织下用户
   */
  editUser (heavyBuyerId, userId, params) {
    return http.put(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/user/${userId}`, params
    )
  },
  /**
   * 删除组织下用户 未实现
   */
  delUser (heavyBuyerId, userId) {
    return http.del(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/user${userId}`
    )
  },

  /**
   * 设置大客户配置
   */
  setConfig (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/entry_config`, params
    )
  },

  /**
   * 批量授权大客户设备
   */
  grantDevices (heavyBuyerId, productId, params) {
    return http.post(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/grant_device?product_id=${productId}`, params
    )
  },
  /**
   * login获取大客户入口配置
   * @param  {String}
   * @return {Promise}
   */
  getConfig (heavyBuyerId, corpId) {
    return http.get(
      `${API_SERVER.default}/v2/heavy_buyer/${heavyBuyerId}/entry_config?corp_id=${corpId}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          // 'Access-Token': '1111'
        }
      }
    )
  }
}
