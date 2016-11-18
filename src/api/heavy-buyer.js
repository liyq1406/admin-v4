import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {

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
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer`, params
    )
  },

  editHeavyBuyer (id, params) {
    return http.put(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${id}`, params
    )
  },

  delHeavyBuyer (id) {
    return http.del(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${id}`
    )
  },

  getHeavyBuyer (params) {
    return http.post(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer_list`, params
    )
  },

  /**
   * 获取组织列表
   */
  getOrganizationList (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${heavyBuyerId}/organization_list`, params
    )
  },

  /**
   * 添加一个组织
   */
  addOrganization (heavyBuyerId, params) {
    return http.post(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${heavyBuyerId}/organization`, params
    )
  },

  /**
   * 批量修改组织
   */
  updateOrganizations (heavyBuyerId, params) {
    return http.put(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${heavyBuyerId}/organization_list`, params
    )
  },

  /**
   * 批量修改组织
   */
  deleteOrganization (heavyBuyerId, organizationId) {
    return http.del(
      `${API_SERVER.heavyBuyer}/v2/heavy_buyer/${heavyBuyerId}/organization/${organizationId}`
    )
  }
}
