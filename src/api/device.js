module.exports = function(Vue, Promise, config) {
  return {
    /**
     * 1.添加设备
     * 调用本接口在某个产品下添加一个设备。
     * @param   product_id
     * @param  {"mac":"MAC地址"}
     * @return status
     */
    add: function(product_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/device', JSON.stringify(params),
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 2.导入设备
     * 用于批量导入设备，如果导入的设备已经存在，则忽略。
     * @param  {Object} params  ["MAC地址1","MAC地址2"]
     * @param           product_id
     * @return status
     */
    batchImport: function(product_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/device_batch', JSON.stringify(params),
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**3.获取设备信息
     * 获取单个设备详细信息。
     * @param  {product_id}
     * @param  {device_id}
     * @return {Promise}
      {
        "id":"设备ID",
        "mac":"MAC地址",
        "is_active":"是否激活",
        "active_date":"激活时间",
        "is_online":"是否在线",
        "last_login":"最近登录时间",
        "active_code":"激活码",
        "authorize_code":"认证码",
        "mcu_mod":"MCU型号",
        "mcu_version":"MCU版本号",
        "firmware_mod":"固件型号",
        "firmware_version":"固件版本号",
        "corp_id":"企业ID",
        "product_id":"产品ID",
        "region_id":"所在区域ID"
      }
     */
    getInfo: function(product_id, device_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id, JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     * 4.查询设备列表
     * @param  {product_id}
     * @param  {Object} params
        {
          "offset":"请求列表的偏移量",
          "limit":"请求数量",
          "filter":["字段A","字段B"],
          "query":
        {
          "filed1":{"$in":["字段值","字段值"]},
          "filed3":{"$lt":"字段值"}
        },
        "order":
        {
          "filed1":"desc",
          "filed2":"asc"
        }
      }
     * @return {Promise}
        {
          "count":"实际返回的条目数",
          "list":
          [
            {
              "id":"设备ID",
              "mac":"MAC地址",
              "is_active":"是否激活",
              "active_date":"激活时间",
              "is_online":"是否在线",
              "last_login":"最近登录时间",
              "active_code":"激活码",
              "authorize_code":"认证码",
              "mcu_mod":"MCU型号",
              "mcu_version":"MCU版本号",
              "firmware_mod":"固件型号",
              "firmware":"固件版本号",
              "product_id":"产品ID",
              "region_id":"所在区域ID"
            }
          ]
        }
     */
    getList: function(product_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/devices', JSON.stringify(params),
          function(data, status, request) {
            console.log(data);
            resolve(data.list);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },

    /**
     *5.删除设备
     *彻底删除设备所有信息，已激活的设备不可删除。
     * @param  {product_id}
     * @param  {device_id}
     * @return status
     */
    delete: function(product_id, device_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id, '',
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')


            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /*6.设置设备扩展属性
     * 调用本接口可以设置设备的扩展属性，扩展属性以Key-Value方式设置储存，扩展属性限制为10个。注意：扩展属性字段名不得包含小数点、空字符，不能以美元符号（$）开头。
     * @param  {Object} params {"{key}":"{value}", "{key}":"{value}"}
     * @param  {product_id}
     * @param  {device_id}
     * @return {Promise} {"{key}":"{value}", "{key}":"{value}"}
     */
    setProperty: function(product_id, device_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/property', JSON.stringify(params),
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /** 7.获取设备扩展属性
     *获取设备扩展属性列表。
     * @param  {product_id}
     * @param  {device_id}

     * @return  {Promise}  {"{key}":"{value}", "{key}":"{value}"}
     */
    addProperty: function(product_id, device_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/property',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /** 8.修改设备扩展属性
     * 修改设备扩展属性值。
     * @param  {Object} params  {"{key}":"{value}", "{key}":"{value}"}
     * @param  {product_id}
     * @param  {device_id}
     * @return status
     */
    alertProperty: function(product_id, device_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.put(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/property', JSON.stringify(params),
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /** 9.获取设备单个扩展属性
     * 获取设备某个扩展属性。
     * @param  {product_id}
     * @param  {device_id}
     * @return  {Promise}  {"{key}":"{value}"}
     */
    getProperty: function(product_id, device_id, key) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/property/' + key,
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**10.删除设备扩展属性
     * 删除某个设备扩展属性。
     * @param  {product_id}
     * @param  {device_id}
     * @param  {key}
     * @return  stauts
     */
    delProperty: function(product_id, device_id, key) {
      return new Promise(function(resolve, reject) {
        Vue.http.delete(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/property/' + key, JSON.stringify(
            params),
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**11.设备激活
      *@param  {Object} params
        {
          "mac":"MAC地址",
          "mcu_mod":"MCU型号",
          "mcu_version":"MCU版本号",
          "frimware_mod":"固件型号",
          "frimware_version":"固件版本号",
          "active_code":"激活码"
        }
      * @return  {Promise}
        {
          "device_id":"设备ID",
          "authorize_code":"认证码"
        }
      */
    activate: function(params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/device_activate', JSON.stringify(
          params), function(data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /** 12.设备认证
      * @param {params}
        {
          "device_id":"设备ID",
          "authorize_code":"认证码"
        }
     * @return  stauts
     */
    auth: function(params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/device_auth', '', function(
          data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**13.更新设备所在区域
     * @param  {product_id}
     * @param  {device_id}
     * @param {params}  {"region_id":"所在区域ID"}
     * @return  stauts
     */
    updateRegion: function(product_id, device_id, params) {
      return new Promise(function(resolve, reject) {
        Vue.http.put(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/region', JSON.stringify(params),
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**14.获取订阅设备的用户列表
     * @param  {product_id}
     * @param  {device_id}
     * @return  {Promise}
        [
          {
            "user_id":"用户ID"
          }
        ]
     */
    subUserList: function(product_id, device_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.get(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/subscribe/users', '',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**15.设备清除所有订阅用户
     * @param  {product_id}
     * @param  {device_id}
     * @return  status
     */
    clearSubUses: function(product_id, device_id) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/product/' + product_id +
          '/device/' + device_id + '/subscribe/clear', '',
          function(data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    },
    /**16.订阅设备
     * @param  {params}  {"user_id":"用户ID","device_id":"设备ID","device_authorize_code":"设备认证码"}
     * @return  status
     */
    deviceSub: function(params) {
      return new Promise(function(resolve, reject) {
        Vue.http.post(config.apiRoot + '/device_subscribe', '',
          function(data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function(data, status, request) {
          reject(JSON.parse(data).error);
        });
      });
    }
  };
};
