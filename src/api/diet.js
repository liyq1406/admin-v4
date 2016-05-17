import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 类别添加、编辑
   * @param {Object} key 区分食材类别/菜谱类别的标识
   * @param {Object} params 食材参数
   */
  updateCategory (app_id, token, params) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/recipeProps/save`, params, {
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
  listCategory (app_id, token, param) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/recipeProps/list`, param, {
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
  addIngredient (app_id, token, params) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/ingredient/save`, params, {
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
  updateIngredient (app_id, token, id, params) {
    return http.put(
      `${apiServer.recipe}/${app_id}/api/ingredient/update/${id}`, params, {
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
  getIngredient (app_id, token, id) {
    return http.get(
      `${apiServer.recipe}/${app_id}/api/ingredient/get/${id}`, {}, {
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
  listIngredient (app_id, token, params) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/ingredient/list`, params, {
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
  deleteIngredient (app_id, token, id) {
    return http.del(
      `${apiServer.recipe}/${app_id}/api/ingredient/delete/${id}`, {}, {
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
  addRecipe (app_id, token, params) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/recipes/save`, params, {
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
  updateRecipe (app_id, token, id, params) {
    return http.put(
      `${apiServer.recipe}/${app_id}/api/recipes/update/${id}`, params, {
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
  getRecipe (app_id, token, id) {
    return http.get(
      `${apiServer.recipe}/${app_id}/api/recipe/get/${id}`, {}, {
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
  listRecipe (app_id, token, params) {
    return http.post(
      `${apiServer.recipe}/${app_id}/api/recipes/list`, params, {
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
  deleteRecipe (app_id, token, id) {
    return http.del(
      `${apiServer.recipe}/${app_id}/api/recipes/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
