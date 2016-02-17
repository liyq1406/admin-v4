module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 添加食材
     * @param {Object} params 食材参数
     */
    addFood (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.recipeApiRoot + 'ingredient/save',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
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
