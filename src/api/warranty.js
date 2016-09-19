import * as http from 'src/http'
import { API_SERVER } from 'consts/config'
export default {
  /**
   * 查询所有已登记的延保纪录列表
   * @param  Object 查询参数
   * @return status
   */
  getWarrantyList (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/warranty/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 查询维修工单
   * @param  Object 查询参数
   * @return status
   */
  getOrderWorkList (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/work_orders/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 查询维修详情
   * @param  Object 查询参数
   * @return status
   */
  getRepairDetailList (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/repair_details/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },
  /**
   * 添加维修详情
   * @param  Object 查询参数
   * @return status
   */
  addRepairDetailList (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/work_orders/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },
  /**
   * 维修概览
   * @param  Object 查询参数
   * @return status
   */
  getSummary (appID) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/work_orders/group`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 查询网点信息
   * @param  Object 查询参数
   * @return status
   */
  getBranchList (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/branch/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 增加网点信息
   * @param  Object 查询参数
   * @return status
   */
  AddBranch (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/branch/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

   /**
    * 修改网点信息
    * @param  Object 查询参数
    * @return status
    */
  UpdateBranch (appID, params, branchId) {
    return http.put(
      `${API_SERVER.warranty}/${appID}/api/branch/update/${branchId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 删除网点信息
   * @param  Object 查询参数
   * @param  String 网点ID
   * @return status
   */
  deleteBranch (appID, branchId) {
    return http.del(
      `${API_SERVER.warranty}/${appID}/api/branch/delete/${branchId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 查询维修点员工列表
   * @param  Object 查询参数
   * @return status
   */
  getBranchStaffsList (appID, params) {
    return http.post(
     `${API_SERVER.warranty}/${appID}/api/outlet_staffs/list`, params, {
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
       }
     }
   )
  },

  /**
  * 增加维修点员工资料
  * @param  Object 查询参数
  * @return status
  */
  AddBranchStaffs (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/outlet_staffs/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
  * 修改维修点员工资料
  * @param  Object 查询参数
  * @return status
  */
  UpdateBranchStaffs (appID, staffId, params) {
    return http.put(
      `${API_SERVER.warranty}/${appID}/api/outlet_staffs/update/${staffId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 删除维修点员工资料
   * @param  Object 查询参数
   * @return status
   */
  deleteStaff (appID, staffId) {
    return http.del(
      `${API_SERVER.warranty}/${appID}/api/outlet_staffs/delete/${staffId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },
  /**
   * 查询标签
   * @param  {string} appID, {string} token {object} params
   * @return promise
   */
  getWarrantyLabel (appID) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/label/list`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 添加标签
   * @param  {string} appID, {string} token {object} params
   * @return promise
   */
  saveWarrantyLabel (appID, params) {
    return http.post(
      `${API_SERVER.warranty}/${appID}/api/label/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  }
}
