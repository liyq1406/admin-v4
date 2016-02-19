
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
        if (app.type === 1) { // iOS应用
          params.apn_enable = app.apn_enable;
          params.apn_license_url = app.apn_license_url;
          params.apn_license_pwd = app.apn_license_pwd;
          params.apn_license_production = app.apn_license_production;
        } else if (app.type === 4) { // 微信应用
          params.wechat = {};
          params.wechat.id = app.wechat.id; // 微信公众号中的微信号
          params.wechat.app_id = app.wechat.app_id; // 微信公众号中的 appID
          params.wechat.app_secret = app.wechat.app_secret; // 微信公众号的 appsecrect
          params.wechat.encrypt = app.wechat.encrypt; // 消息加解密方式
          params.wechat.key = app.wechat.key; // 43位 AESKey
          params.app_url = app.app_url; // 云智易 APP 接收微信消息 URL
        }
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
    }
  };
};
