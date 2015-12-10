
module.exports = function (Vue, Promise, config) {
  return {

    /**
     * 添加规则
     * @param  {Object} 告警规则参数
     * @return {Promise}
        {
          "id":"规则ID",
          "product_id":"产品ID",
          "name":"规则名称",
          "content":"告警内容",
          "type":"告警规则类型",
          "notify_type":"通知类型",
          "notify_target":["1","2","3"],
          "is_enable":"是否启用",
          "param":"参数",
          "compare":"比较类型",
          "value":"比较值",
          "scope":"可见范围"
        }
     */
    addRule: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/alarm/rule', JSON.stringify(params), function (data, status, request) {
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
     * 修改告警规则
     * @param  {String} 告警规则id
     * @param  {Object} 告警规则参数
     * @return {Promise}
     */
    updateRule: function (rule) {
      return new Promise(function (resolve, reject) {
        var params = {
          name: rule.name,
          content: rule.content,
          type: rule.type,
          notify_type: rule.notify_type,
          notify_target: rule.notify_target,
          is_enable: rule.is_enable,
          param: rule.param,
          compare: rule.compare,
          value: rule.value,
          scope: rule.scope
        };

        Vue.http.put(config.apiRoot + '/alarm/rule/' + rule.id, JSON.stringify(params), function (data, status, request) {
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
     * 删除告警规则
     * @param  {String} 告警规则id
     * @return {Promise}
     */
    deleteRule: function (rule_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.delete(config.apiRoot + '/alarm/rule/' + rule_id, function (data, status, request) {
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
     * 获取告警规则列表
     * @param  {String} 产品id
     * @return {Promise}
        [
          {
            "id":"规则ID",
            "name":"规则名称",
            "product_id":"产品ID",
            "content":"告警内容",
            "type":"告警规则类型",
            "notify_type":"通知类型",
            "notify_target":["1","2","3"],
            "is_enable":"是否启用",
            "param":"参数",
            "compare":"比较类型",
            "value":"比较值",
            "scope":"可见范围"
          }
        ]
     */
    getRules: function (product_id) {
      return new Promise(function (resolve, reject) {
        Vue.http.get(config.apiRoot + '/alarm/rules?product_id=' + product_id, function (data, status, request) {
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

  };
};
