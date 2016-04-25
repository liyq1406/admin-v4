import * as http from '../http'
import { apiServer } from '../consts/config'

// var token = window.localStorage.getItem('accessToken')
var token = 'edf3feed54484c37ba06f06731e4b605'

export default {
  /**
   * 查询所有已登记的延保纪录列表
   * @param  Object 查询参数
   * @return status
   */
  getWarrantyList (params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/warranty/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 查询维修工单
   * @param  Object 查询参数
   * @return status
   */
  getOrderWorkList (params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/work_orders/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 查询网点信息
   * @param  Object 查询参数
   * @return status
   */
  getBranchList (params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/branch/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 增加网点信息
   * @param  Object 查询参数
   * @return status
   */
  AddBranch (params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/branch/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

   /**
    * 修改网点信息
    * @param  Object 查询参数
    * @return status
    */
  UpdateBranch (params, branchId) {
    return http.post(
      `${apiServer.warranty}/${token}/api/branch/update/${branchId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
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
  deleteBranch (params, branchId) {
    return http.del(
      `${apiServer.warranty}/${token}/api/branch/delete/${branchId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 查询维修点员工列表
   * @param  Object 查询参数
   * @return status
   */
  getBranchStaffsList (params) {
    return http.post(
     `${apiServer.warranty}/${token}/api/outlet_staffs/list`, params, {
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
       }
     }
   )
  },

  /**
  * 增加维修点员工资料
  * @param  Object 查询参数
  * @return status
  */
  AddBranchStaffs (params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/outlet_staffs/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
  * 修改维修点员工资料
  * @param  Object 查询参数
  * @return status
  */
  getBranchStaffsUpdate (staffId, params) {
    return http.post(
      `${apiServer.warranty}/${token}/api/outlet_staffs/update/${staffId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 删除维修点员工资料
   * @param  Object 查询参数
   * @return status
   */
  deleteStaff (params, staffId) {
    return http.del(
      `${apiServer.warranty}/${token}/api/outlet_staffs/delete/${staffId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
