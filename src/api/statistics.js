var request = require('superagent');
var config = require('../consts/config');
var Promise = require('promise');

module.exports = {
  /**
   * 获取产品摘要信息
   * @return {Object} 返回产品摘要
   */
  getProductSummary: function () {
    return new Promise(function (resolve, reject) {
      request
      .get(config.apiRoot + '/statistics/product/summary')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Token', localStorage.getItem('accessToken'))
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
