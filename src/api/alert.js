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
        Vue.http.post(config.apiRoot + '/alert/rule', JSON.stringify(params), function (data, status, request) {
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
    updateRule: function (rule, product_id) {
      return new Promise(function (resolve, reject) {
        var params = {
          product_id: product_id,
          name: rule.name,
          content: rule.content,
          type: rule.type,
          notify_type: rule.notify_type,
          notify_apps: rule.notify_apps,
          notify_target: rule.notify_target,
          is_enable: rule.is_enable,
          param: rule.param,
          compare: rule.compare,
          value: rule.value,
          scope: rule.scope,
          tag: rule.tag
        };

        console.log(params);

        Vue.http.put(config.apiRoot + '/alert/rule/' + rule.id, JSON.stringify(params), function (data, status, request) {
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
        Vue.http.delete(config.apiRoot + '/alert/rule/' + rule_id, function (data, status, request) {
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
        Vue.http.get(config.apiRoot + '/alert/rules?product_id=' + product_id, function (data, status, request) {
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
     * 获取消息列表
     * @param  {Object} params 查询条件
     * @return {Promise} 告警消息列表
       {
         "count":"总数量",
         "list":
           [
             {
               "id":"消息标识ID",
               "type":"消息类型"
               "product_name":"产品名称",
               "alert_name":"规则名称",
               "alert_value":"告警状态值",
               "notify_type":"通知类型",
               "from":"消息发送者",
               "to":"消息接受者",
               "content":"消息实体",
               "create_date":"创建时间",
               "is_read":"是否已读",
               "tags":"标签"
             }
           ]
         }
     */
    getAlerts: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/messages', JSON.stringify(params), function (data, status, request) {
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
     * 设置消息为已读状态
     * @param {Array} params 消息列表
     */
    setAlertRead: function (params) {
      return new Promise(function (resolve, reject) {
        Vue.http.post(config.apiRoot + '/corp/message_read', JSON.stringify(params), function (data, status, request) {
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
    }

  };
};
