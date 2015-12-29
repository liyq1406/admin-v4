module.exports = function(Vue, Promise, config) {
  return {
    /**
     * 添加产品
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    createProduct: function(params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product', JSON.stringify(
          params), function(data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除产品
     * @param  {Object} product_id 产品Id
     * @return {Promise}
     */
    deleteProduct: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id,
          function(data, status, request) {
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
    },

    /**
     * 更新产品信息
     * @param  {Object} product 产品
     * @return {Promise}
     */
    updateProduct: function(product) {
      return new Promise(function(resolve, reject) {
        var params = {};
        params.name = product.name;
        params.description = product.description;
        params.link_type = product.link_type;
        params.is_release = product.is_release;
        Vue.http.put(config.apiRoot + '/product/' + product.id, JSON.stringify(
          params), function(data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取产品列表
     * @return {Promise}
     */
    getProducts: function() {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/products', function(data,
          status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取产品详细信息
     * @param  {String} product_id 产品Id
     * @return {Promise}
     */
    getProduct: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取产品密钥
     * @param  {String} product_id 产品Id
     * @return {Promise}
     *  {
          "key": "产品密钥"
        }
     */
    getProductKey: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id + '/key',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 添加固件版本
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    addFirmware: function(product_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/firmware', JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 编辑固件版本
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    updateFirmware: function(product_id, firmware) {
      return new Promise(function(resolve, reject) {
        var params = {};
        params.mod = firmware.mod;
        params.version = firmware.version;
        params.file_url = firmware.file_url;
        params.description = firmware.description;
        params.release_date = firmware.release_date;
        params.is_release = firmware.is_release;
        Vue.http.put(config.apiRoot + '/product/' + product_id +
          '/firmware/' + firmware.id, JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除固件版本
     * @param  {Object} product_id 产品Id
     * @param  {Object} firmware_id 固件Id
     * @return {Promise}
     */
    deleteFirmware: function(product_id, firmware_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id +
          '/firmware/' + firmware_id,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取固件版本列表
     * @return {Promise}
     */
    getFirmwares: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/firmwares',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 添加数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} params 参数
     * @return {Promise}
     */
    addDataPoint: function(product_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/datapoint', JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 更新数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    updateDataPoint: function(product_id, datapoint) {
      return new Promise(function(resolve, reject) {
        var params = {};
        params.name = datapoint.name;
        params.type = datapoint.type;
        params.index = datapoint.index;
        params.description = datapoint.description;
        params.symbol = datapoint.symbol;
        Vue.http.put(config.apiRoot + '/product/' + product_id +
          '/datapoint/' + datapoint.id, JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    deleteDataPoint: function(product_id, datapoint_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id +
          '/datapoint/' + datapoint_id,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    getDataPoint: function(product_id, datapoint_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/datapoint/' + datapoint_id,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取数据端点列表
     * @param  {String} product_id 产品Id
     * @return {Promise}
     */
    getDatapoints: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/datapoints',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    },

    uploadFirmware: function(product_id, file) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/upload/product/' + product_id +
          '/firmware', file,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // 'Content-Length': contentLength,
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
