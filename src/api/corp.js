//var request = require('superagent');

module.exports = function (Vue, Promise, config) {
  return {
    /**
     * 1.企业帐号注册
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    register: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp_register', JSON.stringify(params), function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 2.企业认证
     * @param  {Object} params 帐号与密码信息
     * @return {Promise}
     */
    auth: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp_auth', JSON.stringify(params), function (data, status, request) {
          resolve(data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },


   /** 3.获取企业信息
     * 获取企业信息。。
     * @param  {Object} params  {corp_id}
     * @return {Promise}   {  "id":"企业ID", "company":"企业名称", "create_time":"创建时间", "type":"企业应用类型" ,"member":{"id":"成员ID","phone":"手机I号码","email":"邮箱地址","name":"姓名"}}
     */
    getCorp: function () {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/corp',  function (data, status, request) {
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
     * 刷新 Token
     * @param  {Vue model} vm 当前Vue实例
     * @return {Promise}
     */
    refreshToken: function (vm) {
      var today = new Date();

      return new Promise(function (resolve, reject) {
        // if (localStorage.getItem('expireAt') < today.getTime() + 10000) {
        if (localStorage.getItem('expireAt') !== null && today.getTime() < localStorage.getItem('expireAt') && today.getTime() > localStorage.getItem('expireAt') -  localStorage.getItem('expireIn') / 2) {
          Vue.http.post(config.apiRoot + '/corp/token/refresh', JSON.stringify({refresh_token: localStorage.getItem('refreshToken')}), function (data, status, request) {
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('expireIn', data.expire_in);
            localStorage.setItem('expireAt', today.getTime() + data.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 20000);
            resolve(data);
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Token': localStorage.getItem('accessToken')
            }
          }).error(function (data, status, request) {
            reject(data.error);
          });
        } else if (localStorage.getItem('expireAt') !== null && localStorage.getItem('expireAt') < today.getTime()) {
          vm.$route.router.go({path: '/login'});
          //reject('Token expired.');
        } else {
          resolve(true);
        }
      });
    },

    /**
     * 3.重置密码
     * @param  {Object} params 重置密码参数信息
     * @return {Promise}
     */
    resetPassword: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/password/forgot', JSON.stringify(params), function (data, status, request) {
          resolve(status,data);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**4.发起成员邀请邮件
     * 管理员可发起成员邀请，发起后向成员邮箱发送邮件并提供链接，成员通过该链接完善登陆信息。
     * @param  {Object} params  { "email":"成员邮箱地址", "content":"邮件内容","role":"角色类型"}
     * @return {Promise}
     */
    memberInvite: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/member_invite', JSON.stringify(params), function (data, status, request) {
          resolve(status);
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
   /** 5.成员激活邀请
     * 通过本接口完善成员登陆信息后完成激活，这时成员的邮箱是已认证。
     * @param  {Object} params  {"phone":"手机号码", "verifycode":"手机验证码","name":"您的姓名","email":"邮箱地址","password":"登陆密码"}
     * @return {Promise}
     */
    memberActivate: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/corp/member_activate', JSON.stringify(params), function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },
   /** 6. 获取单个成员信息
     * 获取一个成员的基本信息。。
     * @param  {Object} params  {member_id}
     * @return {Promise}   {  "id":"成员ID", "name":"姓名", "role":"角色类型", "status":"成员状态" }
     */
    getMember: function (member_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/corp/member/'+member_id,  function (data, status, request) {
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
     * 7.获取帐号下所有成员列表
     * @param  {Object} params query参数
     * @return {Promise}
     */
    getMembers: function () {
      var today = new Date();

      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/corp/members',function (data, status, request) {
          resolve(data.list);
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
    /** 8.删除单个成员信息
     * 删除一个成员的基本信息
     * @param  {Object} params  {member_id}
     * @return  stauts
     */
    delMember: function (member_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/corp/member/'+ member_id, function (data, status, request) {
          resolve(status);
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
    /**9编辑成员基本信息
     * 成员编辑本成员的基本信息。
     * @param  {Object} params  {"name":"成员姓名"}
     * @param  {member_id}
     * @return  stauts
     */
    putMember: function (member_id,params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/corp/member/'+member_id, JSON.stringify(params), function (data, status, request) {
          resolve(status);
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
   /**10 成员重置密码
     * 成员重置自己的密码，成员只能重置自己的密码，管理员不能修改其他任何成员的密码。
     * @param  {Object} params  { "oldpassword":"旧密码",  "newpassword":"新密码"}
     * @return  stauts
     */
    memberResetPwd: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/corp/member/password/reset', JSON.stringify(params), function (data, status, request) {
          resolve(status);
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
      /**11 成员角色设置
     * 管理员可以设置普通成员的角色。
     * @param   member_id,role_type
     * @return  stauts
     */
    setMemberRole: function (member_id,role_type) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/corp/member/'+member_id+'/role/'+role_type, function (data, status, request) {
          resolve(status);
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
    /**12 停用成员
     * 将成员设置为停用，使成员不可用。
     * @param  {Object} member_id  member_id
     * @return  stauts
     */
    disableMemeber: function (member_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.put(config.apiRoot + '/corp/member/'+member_id+'/disable', function (data, status, request) {
          resolve(status);
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
     * 企业帐号邮箱注册
     * @param  {Object} params 注册信息
     * @return {Promise}
     */
    emailRegister: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp_register_email', JSON.stringify(params), function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    },

    /**
     * 企业帐号邮箱激活
     * @param  {Object} params 激活参数
     * @return {Promise}
     */
    emailActivate: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/email_activate', JSON.stringify(params), function (data, status, request) {
          resolve(status);
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).error(function (data, status, request) {
          reject(data.error);
        });
      });
    }

  };
};
