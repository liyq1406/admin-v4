import * as http from '../http'
import { apiServer } from '../consts/config'

export default {
  /**
   * 类别添加、编辑
   * @param {Object} key 区分食材类别/菜谱类别的标识
   * @param {Object} params 食材参数
   */
  updateCategory (key, params) {
    var args = {}

    args.key = key
    args.value = params

    return http.post(
      `${apiServer.recipe}/recipe_props/save`, args, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材类别查询
   * @param {Object} key 食材类别标识
   */
  listCategory (key) {
    return http.get(
      `${apiServer.recipe}/recipe_props/get/${key}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材添加
   * @param {Object} params 食材参数
   */
  addIngredient (params) {
    return http.post(
      `${apiServer.recipe}/ingredient/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材编辑
   * @param {String} id 食材ID
   * @param {Object} params 食材参数
   */
  updateIngredient (id, params) {
    return http.put(
      `${apiServer.recipe}/ingredient/update/${id}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材查找
   * @param {Object} id 食材ID
   */
  getIngredient (id) {
    return http.get(
      `${apiServer.recipe}/ingredient/get/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材查询
   * @param  {Object} params 查询参数
   */
  listIngredient (params) {
    return http.post(
      `${apiServer.recipe}/ingredient/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 食材删除
   * @param {Object} id 食材ID
   */
  deleteIngredient (id) {
    return http.del(
      `${apiServer.recipe}/ingredient/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 菜谱添加
   * @param {Object} params 菜谱参数
   */
  addRecipe (params) {
    return http.post(
      `${apiServer.recipe}/recipe/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 菜谱编辑
   * @param {String} id     菜谱ID
   * @param {Object} params 菜谱参数
   */
  updateRecipe (id, params) {
    return http.put(
      `${apiServer.recipe}/recipe/update/${id}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 菜谱查找
   * @param {Object} id 菜谱ID
   */
  getRecipe (id) {
    return http.get(
      `${apiServer.recipe}/recipe/get/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 菜谱查询
   * @param  {Object} params 查询参数
   */
  listRecipe (params) {
    return http.post(
      `${apiServer.recipe}/recipe/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  },

  /**
   * 菜谱删除
   * @param {Object} id 菜谱ID
   */
  deleteRecipe (id) {
    return http.post(
      `${apiServer.recipe}/recipe/delete/${id}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
