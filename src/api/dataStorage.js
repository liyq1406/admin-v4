module.exports = function (Vue, Promise, config) {
  return {
    /** 数据存储服务开发文档
      *1.创建数据表
      * @param  {ObjectTable} params 创建数据表信息
          {
            "filed":
                [
                    {"filed1":"数据类型"},
                    {"filed2":"数据类型"}
                ],
            "permission":
                {
                    "owner":["read","update","delete"],
                    "user":["insert","read","update","delete"]
                }
        }
      * @return status
      */
    create: function (params,objectTable) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/data/create/'+objectTable,JSON.stringify(params), function (data, status, request) {
          resolve(status);
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
    *2.新增数据
    * @param  {ObjectTable} params
      {
        "字段A":"字段A的值",
        "字段B":"字段B的值"
      }
    * @return {Promise}
      {
          "objectId":"数据ID",
          "createAt":"创建时间",
          "updateAt":"更新时间",
          "字段A":"字段A的值",
          "字段B":"字段B的值",
          "creator":"创建者"
      }
    */
    addData: function (params,objectTable) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/data/'+objectTable,JSON.stringify(params),function (data, status, request) {
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
    *3.获取数据
    * @param  {ObjectTable} {objectId} params 查询数据表信息
    * @return {Promise}
       {
          "objectId":"数据ID",
          "createAt":"创建时间",
          "updateAt":"更新时间",
          "字段A":"字段A的值",
          "字段B":"字段B的值",
          "creator":"创建者"
      }
    */
    getData: function (objectTable,objectId) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/data/'+objectTable+'/'+objectId, function (data, status, request) {
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
    *4.查询数据
    * @param  {ObjectTable} params 创建数据表信息
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
        "count":"返回的对象数量",
        "list":
            [
                {
                    "objectId":"对象ID",
                    "createAt":"创建时间",
                    "updateAt":"更新时间",
                    "字段A":"字段A的值",
                    "字段B":"字段B的值",
                    "creator":"创建者"
                }
            ]
    }
    */
    dataList: function (params,objectTable) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/data/'+objectTable+'/list',JSON.stringify(params), function (data, status, request) {
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
    *5.修改数据
    * @param  {ObjectTable} {objectId} params 修改数据表信息
       {
          "字段A":"字段A的值",
          "字段B":"字段B的值"
      }
    * @return {Promise}
       {
          "objectId":"对象ID",
          "createAt":"创建时间",
          "updateAt":"更新时间",
          "字段A":"字段A的值",
          "字段B":"字段B的值",
          "creator":"创建者"
      }
    */
    alertData: function (params,objectTable,objectId) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/data/'+objectTable+'/'+objectId,JSON.stringify(params), function (data, status, request) {
          resolve(date);
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
    *6.删除XLink平台数据
    * @param  {ObjectTable} {objectId} params 删除XLink平台数据表信息
    * @return {Promise}
    */
    delAllData: function (objectTable,objectId) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/data/'+objectTable+'/'+objectId,function (data, status, request) {
          resolve(status);
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
