var request = require('superagent');
var config = require('../consts/config');
var Promise = require('promise');

module.exports = {
  /**
   * 向目标手机发送短信验证码，短信验证码在发送后90秒后失效
   * @param  {Object} params 传递参数
   * @example
   *   api.sms.getVerifycode({phone: '13800138000'})
   */
  getVerifycode: function (params) {
    return new Promise(function (resolve, reject) {
      request
      .post(config.apiRoot + '/sms/verifycode')
      .send(JSON.stringify(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }
};
