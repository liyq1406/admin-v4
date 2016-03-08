module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 用户列表查询
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
        "count" : "实际返回数量",
        "list" :
        [
          {
            "id" : "用户ID",
            "phone/email" : "手机号/邮箱",
            "nickname" : "用户昵称",
            "authorize_code":"认证码",
            "create_date" : "创建时间",
            "source" : "用户来源"
          }
        ]
      }
     */
    list: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/users',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取用户详细信息
     * @param  user_id
     * @return {Promise}
      {
        "id" : "用户ID",
        "corp_id":"企业ID",
        "phone/email" : "手机号/邮箱",
        "nickname" : "用户昵称",
        "authorize_code":"认证码",
        "create_date" : "创建时间",
        "source" : "用户来源",
        "region_id":"所在区域ID"
      }
     */
    profile: function (user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/user/' + user_id,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取用户订阅的设备列表
     * @param  {Object} params 重置密码参数信息
     * @return {Promise}
        [
          {
            "id" : "设备ID",
            "mac" : "设备MAC地址",
            "is_active" : "是否激活",
            "active_date" : "激活时间",
            "is_online" : "是否在线",
            "last_login" : "最近登录时间",
            "active_code" : "激活码",
            "authorize_code" : "认证码",
            "mcu_mod" : "MCU型号",
            "mcu_version" : "MCU版本号",
            "firmware_mod" : "固件型号",
            "firmware_version" : "固件版本号",
            "product_id" : "所属的产品ID"
          }
        ]
     */
    subDeviceList: function (user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/user/' + user_id + '/subscribe/devices',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 设置用户扩展属性
     * 用户可以设置自定义扩展属性，扩展属性为Key-Value结构，用户扩展属性限制最多为10个。
     * @param  {Object} user_id
     * @param  {Object} params query参数
        {
          "{key}":"{value}",
          "{key}":"{value}"
        }
     * @return {Promise}
     */
    setPorperty: function (params, user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(
          config.apiRoot + '/user/' + user_id + '/property',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取用户扩展属性
     * @param  {Object} user_id
     * @return {Promise}
        {
          "{key}":"{value}",
          "{key}":"{value}"
        }
     */
    getPropertyList: function (user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/user/' + user_id + '/property',
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 修改用户扩展属性
     * @param  {Object} params
        {
          "{key}":"{value}",
          "{key}":"{value}"
        }
     * @return {Promise}
     */
    alertProperty: function (params, user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/user/' + user_id + '/property',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 获取用户单个扩展属性
     * @param
     * @return {Promise}
        {
          "{key}":"{value}"
        }
     */
    getProperty: function (user_id, key) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(
          config.apiRoot + '/user/' + user_id + '/property/' + key,
          function (data, status, request) {
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 删除用户扩展属性
     * 删除一个成员的基本信息
     * @param  {Object} member_id  成员 ID
     * @param  {String} key  扩展属性
     * @return  stauts
     */
    delAllProperty: function (member_id, key) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(
          config.apiRoot + '/user/' + member_id + '/property/' + key,
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 停用用户
     * 成员编辑本成员的基本信息。
     * @param  {Object} params  {"name":"成员姓名"}
     * @param  {member_id}
     * @return  stauts
     */
    putMember: function (user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/user/' + user_id + '/status',
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 新版停用启用用户
     * 成员编辑本成员的基本信息。
     * @param  {Object} params  {"name":"成员姓名"}
     * @param  {member_id}
     * @return  stauts
     */
    toggleMember: function (user_id, status) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/user/' + user_id + '/status/' + status,
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 更新用户所在区域
     * @param  {Object} params
     * {
        "region_id":"区域ID"
       }
     * @return  stauts
     */
    memberResetPwd: function (params, user_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/user/' + user_id + '/region',
          JSON.stringify(params),
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 成员角色设置
     * 管理员可以设置普通成员的角色。
     * @param   member_id,role_type
     * @return  stauts
     */
    configMemberRole: function (member_id, role_type) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/corp/member/' + member_id + '/role/' + role_type,
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }
        ).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 停用成员
     * 将成员设置为停用，使成员不可用。
     * @param  {Object} member_id  member_id
     * @return  stauts
     */
    disableMemeber: function (member_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(
          config.apiRoot + '/corp/member/' + member_id + '/disable',
          function (data, status, request) {
            resolve(status);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
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
