module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 创建数据表
     * @param  {Object} params 数据表参数
     */
    createTable: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/table', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 修改数据表
     * @param  {Object} table 数据表
     */
    updateTable: function (table) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.type = table.type;
        params.permission = table.permission;
        params.field = table.field;
        console.log(table.name);
        console.log(params);
        Vue.http.put(config.apiRoot + '/table/' + table.name, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取单个数据表
     */
    getTable: function (table_name) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/table/' + table_name, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取数据表列表
     */
    getTables: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/tables', function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除数据表
     * @param  {String} table_name 表名
     */
    deleteTable: function (table_name) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/table/' + table_name, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 创建数据
     * @param  {Object} params 数据参数
     */
    createData: function (table_name, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/data/' + table_name, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取单条数据
     * @param  {String} table_name 表名
     * @param  {String} object_id 数据 id
     */
    getData: function (table_name, object_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/data/' + table_name + '/' + object_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 查询数据
     * @param  {String} table_name 表名
     * @param  {Object} params 数据参数
     */
    queryData: function (table_name, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/datas/' + table_name, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 修改数据
     * @param  {String} table_name 表名
     * @param  {String} object_id 数据 id
     * @param  {Object} params 数据参数
     */
    updateData: function (table_name, object_id, params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/data/' + table_name + '/' + object_id, JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除数据
     * @param  {String} table_name 表名
     * @param  {String} object_id 数据 id
     */
    deleteData: function (table_name, object_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/data/' + table_name + '/' + object_id, function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': localStorage.getItem('accessToken')
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    }
  };
};
