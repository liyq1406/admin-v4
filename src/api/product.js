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
    }
  };
};
