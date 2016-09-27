import api from 'api'
import _ from 'lodash'

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
              let plugin = _.clone(this.plugins[index])
              plugin.id = item.id
              plugin.enable = item.enable
              plugin.platform_status = item.platform_status
              this.plugins.$set(index, plugin)
            }
          })
          this.loading = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loading = false
      })
    },

    /**
     * 切换插件状态
     * @param  {Object} plugin 当前插件
     */
    pluginToggle (plugin) {
      // if (plugin.platform_status && plugin.platform_status === 1) {
      //   this.showAlert('<span>您尚未获得此应用的使用权限，请联系商务或发送邮件到 <span class="hl-red">bd@xlink.cn</span> 申请开通。</span>')
      //   return
      // }
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
        enable: plugin.enable,
        platform_status: plugin.platform_status
      }
      if (plugin.id) {
        api.plugin.update(plugin.id, params).then((res) => {
          if (res.status === 200) {
            this.getPlugins()
            if (plugin.enable) {
              this.createPlugin(obj)
              this.showNotice({
                type: 'success',
                content: `${plugin.name}已启用`
              })
            } else {
              this.removePlugin(obj)
              this.showNotice({
                type: 'info',
                content: `${plugin.name}已禁用`
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
