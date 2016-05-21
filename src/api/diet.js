import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 类别添加、编辑
   * @param {Object} key 区分食材类别/菜谱类别的标识
   * @param {Object} params 食材参数
   */
  updateCategory (appId, token, params) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/recipeProps/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材类别查询
   * @param {Object} key 食材类别标识
   */
  listCategory (appId, token, param) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/recipeProps/list`, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材添加
   * @param {Object} params 食材参数
   */
  addIngredient (appId, token, params) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/ingredient/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材编辑
   * @param {String} id 食材ID
   * @param {Object} params 食材参数
   */
  updateIngredient (appId, token, id, params) {
    return http.put(
      `${apiServer.recipe}/${appId}/api/ingredient/update/${id}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材查找
   * @param {Object} id 食材ID
   */
  getIngredient (appId, token, id) {
    return http.get(
      `${apiServer.recipe}/${appId}/api/ingredient/get/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材查询
   * @param  {Object} params 查询参数
   */
  listIngredient (appId, token, params) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/ingredient/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材删除
   * @param {Object} id 食材ID
   */
  deleteIngredient (appId, token, id) {
    return http.del(
      `${apiServer.recipe}/${appId}/api/ingredient/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱添加
   * @param {Object} params 菜谱参数
   */
  addRecipe (appId, token, params) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/recipes/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱编辑
   * @param {String} id     菜谱ID
   * @param {Object} params 菜谱参数
   */
  updateRecipe (appId, token, id, params) {
    return http.put(
      `${apiServer.recipe}/${appId}/api/recipes/update/${id}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱查找
   * @param {Object} id 菜谱ID
   */
  getRecipe (appId, token, id) {
    return http.get(
      `${apiServer.recipe}/${appId}/api/recipe/get/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱查询
   * @param  {Object} params 查询参数
   */
  listRecipe (appId, token, params) {
    return http.post(
      `${apiServer.recipe}/${appId}/api/recipes/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱删除
   * @param {Object} id 菜谱ID
   */
  deleteRecipe (appId, token, id) {
    return http.del(
      `${apiServer.recipe}/${appId}/api/recipes/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
