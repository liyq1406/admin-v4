
module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 产品固件上传
     * @param  {String} product_id  产品 ID
     * @param  {File} file        文件流数据
     * @return {Promise}
      {
        "url":"固件文件资源地址",
        "md5":"文件MD5值",
        "size":"文件大小"
      }
     */
    firmware: function (product_id, file) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/upload/product/' + product_id + '/firmware', file,
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
    },

    /**
     * APN密钥文件上传
     * @param  {File} file 文件流数据
     * @return {Promise}
      {
        "url":"apn密钥文件下载地址"
      }
     */
    apn: function (file) {
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
