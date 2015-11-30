module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 向目标手机发送短信验证码
     * @param  {Object} params 传递参数
     * @example
     *   api.sms.getVerifycode({phone: '13800138000'})
     */
    getVerifycode: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/sms/verifycode',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    }
  };
};
