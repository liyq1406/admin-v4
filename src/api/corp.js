module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 企业账户注册
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    register: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp_register', JSON.stringify(params), function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 企业认证
     * @param  {Object} params 账号与密码信息
     * @return {Promise}
     */
    auth: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp_auth', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 刷新 Token
     * @param  {Vue model} vm 当前Vue实例
     * @return {Promise}
     */
    refreshToken: function (vm) {
      var today = new Date();

      return new Promise(function (resolve, reject) {
        // if (localStorage.getItem('expireAt') < today.getTime() + 10000) {
        if (localStorage.getItem('expireAt') < today.getTime() + localStorage.getItem('expireIn') / 2) {
          Vue.http.post(config.apiRoot + '/corp/token/refresh', JSON.stringify({refresh_token: localStorage.getItem('refreshToken')}), function (data, status, request) {
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('expireIn', data.expire_in);
            localStorage.setItem('expireAt', today.getTime() + data.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 20000);
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function (data, status, request) {
            reject(JSON.parse(data).error);
          });
        } else if (localStorage.getItem('expireAt') < today.getTime()) {
          vm.$route.router.go({path: '/login'});
          //reject('Token expired.');
        } else {
          resolve(true);
        }
      });
    },

    /**
     * 重置密码
     * @param  {Object} params 重置密码参数信息
     * @return {Promise}
     */
    resetPassword: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/password/forgot', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 获取账户下所有成员列表
     * @param  {Object} params query参数
     * @return {Promise}
     */
    getMembers: function (params) {
      var today = new Date();

      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/corp/members', params, function (data, status, request) {
          resolve(data.list);
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
