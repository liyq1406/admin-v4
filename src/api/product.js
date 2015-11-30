module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 添加产品
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    create: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/product', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 获取产品列表
     * @return {Promise}
     */
    list: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/products', function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 获取单个产品信息
     * @param  {String} id 产品Id
     * @return {Promise}
     */
    get: function (id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    }
  };
};
