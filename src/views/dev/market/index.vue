<template>
  <div class="main">
    <div class="main-title bordered">
      <div class="title-wrap">
        <h2>应用市场</h2>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <p class="market-introduce">云智易物联平台提供多样化的功能扩展，根据您的需求扩展以下服务，让企业服务能力更丰富。</p>
      </div>
      <!-- <div class="panel-hd bordered">
        <h2>应用中心</h2>
      </div> -->
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
      </div>
    </div>
    <!-- 警告弹窗   -->
    <modal :show.sync="isShowAlertModel" @close="isShowAlertModel = false">
      <h3 slot="header">提示</h3>
      <div slot="body" class="form">
        <div class="form-row row">
          {{{alertModel.content}}}
        </div>
        <div class="form-actions">
          <button type="submit" @click.parent="isShowAlertModel = false" v-text="$t('common.ok')" class="btn btn-primary w100"></button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import Modal from 'components/Modal'
  import { globalMixins } from 'src/mixins'
  import Switch from 'components/Switch'
  // import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from './mixins'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins, pluginFactoryMixin],

    vuex: {
      // actions: {
      //   createPlugin,
      //   updatePlugin,
      //   removePlugin
      // }
    },

    components: {
      Modal,
      'switch': Switch
    },

    data () {
      return {
        isShowAlertModel: false,
        alertModel: {
          type: '',
          content: ''
        },
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
          name: '在线维保',
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
        }, {
          id: '',
          name: '云菜谱',
          description: '面向厨电品类产品，可自定义菜谱类别、菜谱图文内容及分类管理。',
          alias: 'recipe',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '内容管理',
          description: '发布文章、资讯，自定义自己的内容资讯版块，让前台内容展示更丰富。',
          alias: 'content',
          enable: false,
          type: 10
        }, {
          id: '',
          name: '环境数据',
          description: '面向空气行业产品，提供室外pm2.5、AQI、pm20、pm25、so2、no2、co、o3等历史与实时数据服务。',
          alias: 'airquality',
          enable: false,
          type: 10
        }, {
          id: '',
          name: 'APP启动页设置',
          description: '对APP进行启动页设置。',
          alias: 'splashwnd',
          enable: false,
          type: 10
        }]
      }
    },

    route: {
      data () {
        this.getPlugins()
      }
    },
    methods: {
      showAlert (str) {
        this.isShowAlertModel = true
        this.alertModel.type = 'warm'
        this.alertModel.content = str
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

  .panel-hd
    margin-bottom 0
    .market-introduce
      background #eaedf2
      padding 10px 14px
      color #62878F
      margin-bottom 0
      margin-top 20px
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
