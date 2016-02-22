module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 类别添加、编辑
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
     * @param {Object} params 食材参数
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
    }
  };
};