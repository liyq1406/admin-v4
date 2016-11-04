import * as http from 'src/http'
import { API_SERVER } from 'consts/config'

export default {
  /**
   * 查询文章
   */
  getArticleList (appID, query) {
    var params = query || {}
    return http.post(
      `${API_SERVER.content}/${appID}/api/article/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 添加文章
   */
  addArticle (appID, params) {
    return http.post(
      `${API_SERVER.content}/${appID}/api/article/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 更新文章
   */
  updateArticle (appID, articleId, params) {
    return http.put(
      `${API_SERVER.content}/${appID}/api/article/update/${articleId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 删除文章
   */
  delArticle (appID, articleId) {
    return http.del(
      `${API_SERVER.content}/${appID}/api/article/delete/${articleId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': JSON.parse(window.localStorage.pluginsToken)[appID].token
        }
      }
    )
  },

  /**
   * 标签查询
   */
  getTags (appId, token, params) {
    return http.post(
      `${API_SERVER.content}/${appId}/api/label/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 标签添加
   */
  addTag (appId, token, params) {
    return http.post(
      `${API_SERVER.content}/${appId}/api/label/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 标签编辑
   */
  editTag (appId, labelId, token, params) {
    return http.put(
      `${API_SERVER.content}/${appId}/api/label/update/${labelId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 标签删除
   */
  delTag (appId, labelId, token) {
    return http.del(
      `${API_SERVER.content}/${appId}/api/label/delete/${labelId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
