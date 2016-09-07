import * as http from 'src/http'
import { API_SERVER } from 'consts/config'
export default {
  /**
   * 运营位查询
   * @param  Object 查询参数
   * @return status
   */
  getOperatePosition (appID, token, params) {
    return http.post(
      `${API_SERVER.operate}/${appID}/api/operatePosition/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 新增运营位
   */
  addOperatePosition (appID, token, params) {
    return http.post(
      `${API_SERVER.operate}/${appID}/api/operatePosition/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 更新运营位
   */
  updateOperatePosition (appID, token, params, operatePositionId) {
    return http.put(
      `${API_SERVER.operate}/${appID}/api/operatePosition/update/${operatePositionId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 删除运营位
   */
  delOperatePosition (appID, token, operatePositionId) {
    return http.del(
      `${API_SERVER.operate}/${appID}/api/operatePosition/delete/${operatePositionId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 运营位查询
   * @param  Object 查询参数
   * @return status
   */
  getOperatePositionContent (appID, token, params) {
    return http.post(
      `${API_SERVER.operate}/${appID}/api/content/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 新增运营位
   */
  addOperatePositionContent (appID, token, params) {
    return http.post(
      `${API_SERVER.operate}/${appID}/api/content/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 更新运营位
   */
  updateOperatePositionContent (appID, token, params, contentId) {
    return http.put(
      `${API_SERVER.operate}/${appID}/api/content/update/${contentId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 删除运营位
   */
  delOperatePositionContent (appID, token, contentId) {
    return http.del(
      `${API_SERVER.operate}/${appID}/api/content/delete/${contentId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
