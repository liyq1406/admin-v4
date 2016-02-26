module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 添加设备转发规则
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    addRule: function (product_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id + '/dds', JSON.stringify(params),
        function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },
    /**
     * 删除设备转发规则
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    deleteRule: function (product_id, dispatch_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id + '/dds/' + dispatch_id,
        JSON.stringify(params),
        function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },
    /**
     * 更新设备转发规则
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    updateRule: function (product_id, dispatch_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/product/' + product_id + '/dds/' + dispatch_id,
        JSON.stringify(params),
        function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },
    /**
     * 获取设备转发规则
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    getRule: function (product_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id + '/dds_list', function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
