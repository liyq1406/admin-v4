import api from '../../api'
import _ from 'lodash'
const INVALID = 'invalid'

export const pluginFactoryMixin = {
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
    }
  }
}

export const pluginMixins = {
  methods: {
    getAppToKen (appID, plugin) {
      var self = this
      return new Promise((resolve, reject) => {
        var token = self.getPluginToken(plugin)

        if (token && token !== INVALID) {
          resolve(token)
        } else {
          var params = {
            'app_id': appID
          }
          api.plugin.getAppToKen(params).then((res) => {
            if (res.status === 200) {
              self.setPluginToken(plugin, res.data.access_token)
              resolve(res.data.access_token)
            }
          }, (err) => {
            if (reject) {
              reject(err)
            } else {
              console.log(err)
            }
          })
        }
      })
    },

    handlePluginError (err, env) {
      var self = this
      if (err.status === 403 && err.data.code === 4031003) {
        // 重新请求
        // 引用自身，会造成死循环, 加一个限制，最多执行重复请求3次
        self.setPluginToken(env.plugin, INVALID)

        setTimeout(() => {
          self.reRequest(env)
        }, 100)
      } else {
        env.context.handleError(err)
      }
    },

    setPluginToken (plugin, value) {
      switch (plugin) {
        case 'warranty':
          window.localStorage.warrantyAccessToken = value
          break
        case 'recipe':
          window.localStorage.recipeAccessToken = value
          break
        default:
          break
      }
    },

    getPluginToken (plugin) {
      var token = ''
      switch (plugin) {
        case 'warranty':
          token = window.localStorage.warrantyAccessToken
          break
        case 'recipe':
          token = window.localStorage.recipeAccessToken
          break
        default:
          break
      }

      return token
    },

    reRequest (env) {
      if (env.fn instanceof Function && env.argvs instanceof Object && env.context instanceof Object) {
        env.fn.apply(env.context, env.argvs)
      }
    }
  }
}
