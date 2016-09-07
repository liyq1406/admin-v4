import * as http from 'src/http'
import { API_SERVER } from 'consts/config'
export default {
  /**
   * 类别查询
   * @param  Object 查询参数
   * @return status
   */
  getCategories (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/recipeProps/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 类别保存
   */
  createCategory (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/recipeProps/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 类别编辑
   */
  updateCategory (appId, recipePropsID, token, params) {
    return http.put(
      `${API_SERVER.recipes}/${appId}/api/recipeProps/update/${recipePropsID}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 类别删除
   */
  deleteCategory (appId, recipePropsID, token) {
    return http.del(
      `${API_SERVER.recipes}/${appId}/api/recipeProps/delete/${recipePropsID}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱查询
   */
  getRecipes (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/recipes/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱添加
   */
  addRecipes (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/recipes/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱编辑
   */
  editRecipes (appId, recipesID, token, params) {
    return http.put(
      `${API_SERVER.recipes}/${appId}/api/recipes/update/${recipesID}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜谱删除
   */
  delRecipes (appId, recipesID, token) {
    return http.del(
      `${API_SERVER.recipes}/${appId}/api/recipes/delete/${recipesID}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材查询
   */
  getFood (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/ingredient/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材添加
   */
  addFood (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/ingredient/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材编辑
   */
  editFood (appId, ingredientID, token, params) {
    return http.put(
      `${API_SERVER.recipes}/${appId}/api/ingredient/update/${ingredientID}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 食材删除
   */
  delFood (appId, ingredientID, token) {
    return http.del(
      `${API_SERVER.recipes}/${appId}/api/ingredient/delete/${ingredientID}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 标签查询
   */
  getTags (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/label/list`, params, {
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
      `${API_SERVER.recipes}/${appId}/api/label/save`, params, {
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
      `${API_SERVER.recipes}/${appId}/api/label/update/${labelId}`, params, {
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
      `${API_SERVER.recipes}/${appId}/api/label/delete/${labelId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜单查询
   */
  getMenus (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/menu/list`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜单添加
   */
  addMenu (appId, token, params) {
    return http.post(
      `${API_SERVER.recipes}/${appId}/api/menu/save`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜单编辑
   */
  editMenu (appId, labelId, token, params) {
    return http.put(
      `${API_SERVER.recipes}/${appId}/api/menu/update/${labelId}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  },

  /**
   * 菜单删除
   */
  delMenu (appId, labelId, token) {
    return http.del(
      `${API_SERVER.recipes}/${appId}/api/menu/delete/${labelId}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': token
        }
      }
    )
  }
}
