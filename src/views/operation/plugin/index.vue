<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("ui.subs.plugins") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="plugin-grid row">
            <div class="col-12" v-for="plugin in plugins">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img :src="'static/images/'+plugin.alias+'.png'" alt="">
                  </div>
                  <div class="info">
                    <h3>{{ plugin.name }}</h3>
                    <p>{{ plugin.description }}</p>
                  </div>
                  <span class="status">
                    <switch :disabled="loading" size="small" :value.sync="plugin.enable" @switch-toggle="pluginToggle(plugin)"></switch>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from './mixins'

  export default {
    name: 'Data',

    mixins: [pluginFactoryMixin],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
    },

    data () {
      return {
        secondaryNav: [],
        loading: false,
        plugins: [{
          id: '',
          name: '消息推送',
          description: '让app具备消息广播，运营通知的特性，支持多维度的推送规则管理。',
          alias: 'broadcast',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '用户反馈',
          description: '建立在用户与企业之间的反馈渠道，包括使用、售后、故障等业务服务。',
          alias: 'helpdesk',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '智能维保',
          description: '提供与企业产品相关的售后支持、产品维护、保修记录的查询与管理服务。',
          alias: 'warranty',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '经销商管理',
          description: '管理企业各经销商，配置商家信息和销售资源数据。',
          alias: 'dealer',
          enable: false,
          type: 10
        }]
      }
    },

    route: {
      data () {
        this.getPlugins()
        return {
          secondaryNav: [{
            label: this.$t('ui.subs.plugins.extensions'),
            link: { path: '/plugins/extensions' }
          },
          {
            label: this.$t('ui.subs.plugins.customize'),
            link: { path: '/plugins/customize' }
          }]
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../../assets/stylus/common'

  .plugin-grid
    .col-12:nth-child(even)
      .plugin-grid-item
        padding-left 10px

    .col-12:nth-child(odd)
      .plugin-grid-item
        padding-right 10px

  .plugin-grid-item
    padding-top 20px

    .inner
      border 1px solid default-border-color
      padding 15px 20px 15px 15px
      position relative
      clearfix()

    .thumb
      float left
      size 80px
      margin-right 20px

      img
        display block
        size 80px

    .info
      h3
        margin 0 0 10px
        font-weight normal
        font-size 16px

      p
        margin 0
        color gray

    .status
      absolute right 20px top 15px
</style>
