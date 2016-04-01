module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 发送邮件验证码
     * 通过本接口向目标邮箱发送验证码进行验证邮箱有效性，邮箱验证码在发送后90秒有效。
     * @param  params
        {
         "email":"邮箱地址"
        }
     * @return status
     */
    getVerifycode: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/email/verifycode',
          JSON.stringify(params),
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
     * 创建邮件模板
     * @return status
     */
    createTemplate: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/email/template',
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
     * 修改邮件模板
     * @return status
     */
    updateTemplate: function (id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/email/template/' + id,
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
     * 获得邮件模板列表
     * @return status
     */
    getTemplateList: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/email/template_list',
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
     * 获取邮件发送域名
     * @return status
     */
    getAddress: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/corp/email_domain',
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
     * 设置邮件发送域名
     * @return status
     */
    setAddress: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/corp/email_domain',
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
    }

  };
};
