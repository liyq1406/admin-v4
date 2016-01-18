
module.exports = function (Vue, Promise, config) {
  return {
    /**
     * [create description]
     * @param  {[type]} product_id [description]
     * @param  {[type]} params     [description]
     * @return {Promise}
      {
        "id":"APP的标识ID",
        "name":"APP名称",
        "type":"APP类型",
        "apn_enable":"APN推送是否启用",
        "apn_license_url":"APN密钥文件地址",
        "apn_license_pwd":"APN密钥文件密码",
        "create_time":"创建时间"
      }
     */
    create: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/developer/app', JSON.stringify(params),
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
     * 更新应用信息
     * @param  {Object} app 目标应用
     * @return {Promise}
     */
    update: function (app) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.name = app.name;
        params.type = app.type;
        params.apn_enable = app.apn_enable;
        params.apn_license_url = app.apn_license_url;
        params.apn_license_pwd = app.apn_license_pwd;
        params.apn_license_production = app.apn_license_production;
        Vue.http.put(
          config.apiRoot + '/developer/app/' + app.id,
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
     * 获取应用列表
     * @return {Promise}
     */
    list: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/developer/apps',
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
     * 删除应用
     * @param  {Object} app 目标应用
     * @return {Promise}
     */
    remove: function (id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(
          config.apiRoot + '/developer/app/' + id,
          function (data, status, request) {
            resolve(status);
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
     * APN密钥文件上传
     * @param  {File} file 文件流数据
     * @return {Promise}
      {
        "url":"apn密钥文件下载地址"
      }
     */
    uploadApn: function (file) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/upload/app/apn_license',
          file,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // 'Content-Length': contentLength,
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
