module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 1.添加产品
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    create: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/product', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 2.删除产品
     * @param  {Object} product_id 产品Id
     * @return {Promise}
     */
    create: function (product_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 3.更新产品信息
     * @param  {Object} product 产品
     * @return {Promise}
     */
    update: function (product) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.name = product.name;
        params.description = product.description;
        params.link_type = product.link_type;
        params.is_release = product.is_release;
        Vue.http.put(config.apiRoot + '/product/' + product_id, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 4.获取产品列表
     * @return {Promise}
     */
    list: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/products', function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 5.获取产品详细信息
     * @param  {String} product_id 产品Id
     * @return {Promise}
     */
    get: function (product_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 6.添加固件版本
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    addFirmware: function (product_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id + '/firmware', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 7.编辑固件版本
     * @param  {Object} params 产品信息
     * @return {Promise}
     */
    updateFirmware: function (product_id, firmware) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.mod = firmware.mod;
        params.version = firmware.version;
        params.file_url = firmware.file_url;
        params.description = firmware.description;
        params.release_date = firmware.release_date;
        params.is_release = firmware.is_release;
        Vue.http.put(config.apiRoot + '/product/' + product_id + '/firmware/' + firmware.id, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 8.删除固件版本
     * @param  {Object} product_id 产品Id
     * @param  {Object} firmware_id 固件Id
     * @return {Promise}
     */
    deleteFirmware: function (product_id, firmware_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id + '/firmware/' + firmware_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 9.获取固件版本列表
     * @return {Promise}
     */
    getFirmwares: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/products/' + firmwares, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 10.添加数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} params 参数
     * @return {Promise}
     */
    addDataPoint: function (product_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id + '/datapoint', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 11.更新数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    updateDataPoint: function (product_id, datapoint) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.name = datapoint.name;
        params.type = datapoint.type;
        params.index = datapoint.index;
        params.description = datapoint.description;
        params.symbol = datapoint.symbol;
        Vue.http.put(config.apiRoot + '/product/' + product_id + '/datapoint/' + datapoint.id, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 12.删除数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    deleteDataPoint: function (product_id, datapoint_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id + '/datapoint/' + datapoint_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 13.获取数据端点
     * @param  {String} product_id 产品Id
     * @param  {Object} datapoint 数据端点
     * @return {Promise}
     */
    getDataPoint: function (product_id, datapoint_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id + '/datapoint/' + datapoint_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 14.获取数据端点列表
     * @param  {String} product_id 产品Id
     * @return {Promise}
     */
    datapoints: function (product_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id + '/datapoints', function (data, status, request) {
          resolve(data);
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
