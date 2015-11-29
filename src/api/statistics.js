var config = require('../consts/config');
var Promise = require('promise');

module.exports = {
  /**
   * 获取产品摘要信息
   * @return {Object} 返回产品摘要
   */
  getProductSummary: function () {
    return new Promise(function (resolve, reject) {
      Vue.http.get(config.apiRoot + '/statistics/product/summary', function (data, status, request) {
        resolve(data);
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Token': localStorage.getItem('accessToken')
        }
      }).error(function (data, status, request) {
        reject(data);
      });
    });
  }
};
