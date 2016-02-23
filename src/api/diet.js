module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 类别添加、编辑
     * @param {Object} key 区分食材类别/菜谱类别的标识
     * @param {Object} params 食材参数
     */
    editCategory (key, params) {
      var args = {};
      args.key = key;
      args.value = params;
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.recipeApiRoot + '/recipe_food/save',
          JSON.stringify(args),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材类别查询
     * @param {Object} key 食材类别标识
     */
    listCategory (key) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.recipeApiRoot + '/recipe_food/get/' + key,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材添加
     * @param {Object} params 食材参数
     */
    addFood (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.recipeApiRoot + '/ingredient/save',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材编辑
     * @param {String} id 食材ID
     * @param {Object} params 食材参数
     */
    updateFood (id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.recipeApiRoot + '/ingredient/update/' + id,
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材查找
     * @param {Object} id 食材ID
     */
    getFood (id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.recipeApiRoot + '/ingredient/get/' + id,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材查询
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    listFood (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.recipeApiRoot + '/ingredient/list',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 食材删除
     * @param {Object} id 食材ID
     */
    deleteFood (id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(
          config.recipeApiRoot + '/ingredient/delete/' + id,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              // 'Access-Token': localStorage.getItem('accessToken'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
