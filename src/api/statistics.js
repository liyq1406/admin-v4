module.exports = function(Vue, Promise, config) {
  return {
    /**
     * 获取汇总摘要信息
     * @return {Object} 返回产品摘要
     *  {
          "device":
          {
            "activated":"设备总激活数",
            "total":"设备总数",
            "online":"设备在线数量"
          },
          "user":
          {
            "total":"用户总数"
          }
        }
     */
    getSummary: function() {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/summary',
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
     * 获取产品摘要信息
     * @return {Object} 返回产品摘要
     *  {
          "total":"总设备量",
          "activated":"激活总数",
          "online":"设备在线数",
          "send_times":"发送指令次数",
          "send_bytes":"发送指令总字节数",
          "recv_times":"接收指令次数",
          "recv_bytes":"接收指令总字节数"
        }
     */
    getProductSummary: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/product/' + product_id + '/summary',
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
     * 获取产品趋势信息
     * @return {Object} 返回产品趋势
     *  [
          {
            "day":"日期，如2015-12-10",
            "activated":"激活设备量",
            "active":"活跃设备量"
            "send_times":"发送指令次数",
            "send_bytes":"发送数据总数",
            "recv_times":"接收指令次数",
            "recv_bytes":"接收数据总数"
          }
        ]
     */
    getProductTrend: function(product_id, start_day, end_day) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/product/' + product_id + '/trend?start_day=' + start_day + '&end_day=' + end_day,
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
     * 获取用户摘要信息
     * @return {Object} 返回用户摘要
     *  {
          "total":"总用户数",
          "online":"在线数",
          "send_times":"发送指令次数",
          "send_bytes":"发送指令总字节数",
          "recv_times":"接收指令次数",
          "recv_bytes":"接收指令总字节数"
        }
     */
    getUserSummary: function() {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/user/summary',
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
     * 获取用户趋势信息
     * @return {Object} 返回用户趋势
     *  [
          {
            "day":"日期，如2015-12-10",
            "activated":"激活设备量",
            "active":"活跃设备量"
            "send_times":"发送指令次数",
            "send_bytes":"发送数据总数",
            "recv_times":"接收指令次数",
            "recv_bytes":"接收数据总数"
          }
        ]
     */
    getUserTrend: function(start_day, end_day) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/user/trend?start_day=' + start_day + '&end_day=' + end_day,
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
     * 获取产品区域分布
     * @param {String} product_id 产品id
     * @return {Object} 返回产品区域分布
     *  {
         "China":
          {
            "guangdong":
            {
              "activated":4,
              "shenzhen":
              {
                "activated":4
              }
            },
            "activated":4
          }
        }
     */
    getProductRegion: function(product_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/product/' + product_id + '/region',
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
     * 获取用户区域分布
     * @return {Object} 返回用户区域分布
     *  {
         "China":
          {
            "register":4,
            "guangdong":
            {
              "register":4,
              "shenzhen":
              {
                "register":4
              }
            }
          }
        }
     */
    getUserRegion: function() {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/statistics/user/region',
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
    }
  };
};
