var request = require('superagent');
var config = require('../consts/config');
var Promise = require('promise');

module.exports = {
  /**
   * 企业账户注册
   * @param  {Object} params 注册信息
   * @return {Promise}
   */
  register: function (params) {
    return new Promise(function (resolve, reject) {
      request
      .post(config.apiRoot + '/corp_register')
      .send(JSON.stringify(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  },

  /**
   * 企业认证
   * @param  {Object} params 账号与密码信息
   * @return {Promise}
   */
  auth: function (params) {
    return new Promise(function (resolve, reject) {
      request
      .post(config.apiRoot + '/corp_auth')
      .send(JSON.stringify(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(err);
        }
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
      if (localStorage.getItem('expireAt') < today.getTime() + localStorage.getItem('expireIn') / 2) {
        request
        .post(config.apiRoot + '/corp/token/refresh')
        .send(JSON.stringify({refresh_token: localStorage.getItem('refreshToken')}))
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Token', localStorage.getItem('accessToken'))
        .end(function (err, res) {
          if (res.status === 200) {
            localStorage.setItem('accessToken', res.body.access_token);
            localStorage.setItem('refreshToken', res.body.refresh_token);
            localStorage.setItem('expireIn', res.body.expire_in);
            localStorage.setItem('expireAt', today.getTime() + res.body.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 20000);
            resolve(res);
          } else {
            reject(err);
          }
        });
      } else if (localStorage.getItem('expireAt') < today.getTime()) {
        vm.$route.router.go({path: '/login'});
        //reject('Token expired.');
      }
    });
  },

  /**
   * 重置密码
   * @param  {Object} params 重置密码参数信息
   * @return {Promise}
   */
  resetPassword: function (params) {
    return new Promise(function (resolve, reject) {
      request
      .put(config.apiRoot + '/corp/password/forgot')
      .send(JSON.stringify(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  },

  /**
   * 获取账户下所有成员列表
   * @param  {Object} params query参数
   * @return {Promise}
   */
  getMembers: function (params) {
    var today = new Date();

    return new Promise(function (resolve, reject) {
      request
      .get(config.apiRoot + '/corp/members')
      .query(params)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Token', localStorage.getItem('accessToken'))
      .end(function (err, res) {
        if (res.status === 200) {
          resolve(res.body.list);
        } else {
          reject(err);
        }
      });
    });
  }
};
