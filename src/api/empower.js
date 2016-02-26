module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 创建AccessTokey，用于开发者接入。
      @param  {Object} params
      {
        "name":"名称"
      }
      @return {Promise}
      {
        "id":"授权ID",
        "name":"名称",
        "access_token":"授权Token",
        "status":"授权状态"
      }
    */
    createEmpower: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/empower',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 启动授权
      @param  {String} empower_id
      @return {Promise}
    */
    startEmpower: function (empower_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/empower/' + empower_id + '/enable',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 禁用授权
      @param  {String} empower_id
      @return {Promise}
    */
    disableEmpower: function (empower_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/empower/' + empower_id + '/disable',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除授权
      @param  {String} empower_id
      @return {Promise}
    */
    deleteEmpower: function (empower_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(
          config.apiRoot + '/empower/' + empower_id,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取授权列表
      @return {Promise}
      [
        {
          "id":"授权ID",
          "name":"名称",
          "access_token":"授权Token",
          "status":"授权状态"
        }
      ]
    */
    getEmpowers: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/empowers',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取 v1 旧版的 AccessKey 列表
     */
    getAccessKeys: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRootV1 + '/accesskeys',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
