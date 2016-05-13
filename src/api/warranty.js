import * as http from '../http'
import { apiServer } from '../consts/config'
export default {
  /**
   * 查询所有已登记的延保纪录列表
   * @param  Object 查询参数
   * @return status
   */
  getWarrantyList (appID, token, params) {
    return http.post(
      `${apiServer.warranty}/${appID}/api/warranty/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 查询维修工单
   * @param  Object 查询参数
   * @return status
   */
  getOrderWorkList (appID, token, params) {
    return http.post(
      `${apiServer.warranty}/${appID}/api/work_orders/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 查询维修详情
   * @param  Object 查询参数
   * @return status
   */
  getRepairDetailList (appID, token, params) {
    return http.post(
      `${apiServer.warranty}/${appID}/api/repair_details/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 查询网点信息
   * @param  Object 查询参数
   * @return status
   */
  getBranchList (appID, token, params) {
    return http.post(
      `${apiServer.warranty}/${appID}/api/branch/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
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
      `${apiServer.warranty}/${appID}/api/branch/save`, params, {
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
  UpdateBranch (appID, params, branchId) {
    return http.put(
      `${apiServer.warranty}/${appID}/api/branch/update/${branchId}`, params, {
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
  deleteBranch (appID, branchId) {
    return http.del(
      `${apiServer.warranty}/${appID}/api/branch/delete/${branchId}`, {}, {
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
  getBranchStaffsList (appID, params) {
    return http.post(
     `${apiServer.warranty}/${appID}/api/outlet_staffs/list`, params, {
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
  AddBranchStaffs (appID, params) {
    return http.post(
      `${apiServer.warranty}/${appID}/api/outlet_staffs/save`, params, {
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
  UpdateBranchStaffs (appID, staffId, params) {
    return http.put(
      `${apiServer.warranty}/${appID}/api/outlet_staffs/update/${staffId}`, params, {
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
  deleteStaff (appID, staffId) {
    return http.del(
      `${apiServer.warranty}/${appID}/api/outlet_staffs/delete/${staffId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
