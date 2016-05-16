<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="extension-list">
        <ul>
          <li v-for="plugin in plugins">
            <h3>{{ plugin.name }}</h3>
            <div class="row">
              <div class="col-20">
                <p>{{ plugin.description }}</p>
              </div>
              <div class="col-4 tar">
                <switch :disabled="loading" :value.sync="plugin.enable" @switch-toggle="pluginToggle(plugin)"></switch>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Modal from '../../components/Modal'
  import Switch from '../../components/Switch'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  import { globalMixins } from '../../mixins'
  import { pluginFactoryMixin } from './mixins'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins, pluginFactoryMixin],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'modal': Modal,
      'switch': Switch
    },

    data () {
      return {
        loading: false,
        plugins: [{
          id: '',
          name: '云菜谱',
          description: '为面向厨电领域的产品提供关于菜谱的浏览、上传、智能烹饪的服务场景。让用户在app终端上除使用产品外还可以扩展和产品相关的菜谱信息服务。',
          alias: 'recipe',
          enable: false,
          type: 10
        }, {
          id: '',
          name: 'Google nest互联',
          description: 'nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。',
          alias: 'nest',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '支付网关',
          description: '集成支付宝、微信的第三方支付渠道。',
          alias: 'xpay',
          enable: false,
          type: 10
        }]
      }
    },

    route: {
      data () {
        this.getPlugins()
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .extension-list
    li
      padding 20px 0
      border-bottom 1px solid default-border-color

      &:last-child
        border none

      h3
        font-weight normal
        font-style 16px
        margin 0 0 10px

      p
        margin 0
        color gray
</style>
