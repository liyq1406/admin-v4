module.exports = function(Vue, Promise, config) {
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
    getVerifycode: function(params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/email/verifycode', JSON.stringify(
          params), function(data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
