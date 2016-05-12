import api from '../../api'
import _ from 'lodash'

export const pluginMixins = {
  methods: {
    /**
     * 获取插件列表
     */
    getPlugins () {
      this.loading = true
      api.plugin.all().then((res) => {
        if (res.status === 200) {
          var pluginTypes = _.map(this.plugins, 'alias')
          res.data.list.forEach((item) => {
            var index = _.indexOf(pluginTypes, item.plugin)
            if (index >= 0) {
              this.plugins[index].id = item.id
              this.plugins[index].enable = item.enable
            }
          })
          this.loading = false
        }
      }).catch((res) => {
        // this.handleError(res)
        this.loading = false
      })
    },

    /**
     * 切换插件状态
     * @param  {Object} plugin 当前插件
     */
    pluginToggle (plugin) {
      this.loading = true
      var params = {
        name: plugin.name,
        enable: plugin.enable,
        config: {
          url: `/plugins/${plugin.alias}`
        }
      }
      var obj = {
        id: plugin.id,
        name: plugin.name,
        plugin: plugin.alias,
        type: plugin.type,
        enable: plugin.enable
      }
      if (plugin.id) {
        api.plugin.update(plugin.id, params).then((res) => {
          if (res.status === 200) {
            this.getPlugins()
            if (plugin.enable) {
              this.createPlugin(obj)
              this.showNotice({
                type: 'success',
                content: `${plugin.name}插件已启用`
              })
            } else {
              this.removePlugin(obj)
              this.showNotice({
                type: 'info',
                content: `${plugin.name}插件已禁用`
              })
            }
          }
          this.loading = false
        }).catch((res) => {
          this.handleError(res)
          this.loading = false
        })
      } else {
        api.plugin.create({
          name: plugin.name,
          type: 10,
          enable: true,
          plugin: plugin.alias
        }).then((res) => {
          this.loading = false
          obj.id = res.data.id
          obj.enable = true
          this.createPlugin(obj)
          this.getPlugins()
          this.showNotice({
            type: 'success',
            content: `${plugin.name}插件创建成功`
          })
        }).catch((res) => {
          this.handleError(res)
          this.loading = false
        })
      }
    },

    getAppToKen (appID) {
      return new Promise((resolve, reject) => {
        var token = window.localStorage.warrantyAccessToken
        if (token && token !== 'invalid') {
          resolve(window.localStorage.warrantyAccessToken)
        } else {
          var params = {
            'app_id': appID
          }
          api.plugin.getAppToKen(params).then((res) => {
            if (res.status === 200) {
              window.localStorage.warrantyAccessToken = res.data.access_token
              resolve(res.data.access_token)
            }
          }, (err) => {
            reject(err)
          })
        }
      })
    }
  }
}
