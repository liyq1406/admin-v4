<template>
  <div class="main">
    <!-- 标题 -->
    <div class="main-title">
      <div class="title-wrap">
        <h2>应用中心</h2>
      </div>
    </div>

    <!-- 过滤条件 -->
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item" v-if="filterOptions.length">
          <v-select :label="selectedFilter.name" width="110px" size="small">
            <span slot="label">应用类型</span>
            <select v-model="selectedFilter" @change="resetSelectedApp">
              <option :value="option" v-for="option in filterOptions">{{ option.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost" @click="showAddModal=true">
            <i class="fa fa-plus"></i>
            添加应用
          </button>
          <!-- <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker> -->
        </div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="panel no-split-line">
      <div class="panel-bd apps-container">
        <!-- 应用列表  -->
        <div class="app-list-box">
          <div class="app" v-for="app in appList" :class="{'selected': app.id === selectedApp.id}" @click="selectedApp=app">
            <div class="app-name">
              <span>{{app.name}}</span>
            </div>
            <div class="app-type">
              <span class="type">{{computedAppType(app.type)}}</span>
              <span class="ml5">版本号</span>
            </div>
          </div>
        </div>
        <!-- 应用详情 -->
        <div class="panel app-details-box">
          <!-- 详情头部 -->
          <div class="panel-hd">
            <div class="app-name">
              <span>{{selectedApp.name}}</span>
            </div>
            <div class="app-msg clearfix">
              <div class="msg-box id-box fl mr30">
                <span>应用ID：</span>
                <span>{{selectedApp.id}}</span>
              </div>
              <div class="msg-box type-box fl mr30">
                <span>应用类型：</span>
                <span>{{computedAppType(selectedApp.type)}}</span>
              </div>
              <div class="msg-box time-box fl">
                <span>创建时间：</span>
                <span>{{formatDate(selectedApp.create_time)}}</span>
              </div>
              <div class="msg-box secret-box fr" @click="showSecret">
                <span class="hl-red">Access Key Secret</span>
              </div>
            </div>
          </div>
          <!-- 详情内容 -->
          <div class="panel-bd mt20">
            <div class="tab-s2 tab-s2-full mb5">
              <ul>
                <li :class="{'active': selectedTabIndex-0===1}" @click="selectedTabIndex=1">应用配置</li>
                <li :class="{'active': selectedTabIndex-0===2}" @click="selectedTabIndex=2">升级管理</li>
              </ul>
            </div>
            <component v-if="selectedApp" :is="componentName" :app="selectedApp" @update-curr-app="getApps" transition="view" transition-mode="out-in"></component>
          </div>
        </div>
      </div>
    </div>

    <!-- Start: 新增添加应用浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">添加应用</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onAddSubmit">
          <div class="form-row row">
            <label class="form-control col-6">应用名称:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入应用名称'" class="input-text-wrap">
                <input v-model="addModal.name" type="text" class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">应用类型:</label>
            <div class="controls col-18">
              <div class="radio-group radio-group-v">
                <label v-for="type in appTypes" class="radio app-type-radio">
                  <input type="radio" v-model="addModal.type" name="type" :value="$index+1"/>
                  <span>{{ type.name }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 新增添加应用浮层-->
    <!-- Start: 查看密钥浮层-->
    <modal :show.sync="showSecretModal">
      <h3 slot="header">Access Key Secret</h3>
      <div slot="body" class="form">
        <div slot="body" class="secret-key tac">
          {{ selectedApp.secret }}
          <!-- <div class="form-actions">
            <button v-text="$t('common.ok')" class="btn btn-primary"></button>
          </div> -->
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
  import api from 'api'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import { pluginFactoryMixin } from './mixins'
  import { formatDate } from 'src/filters'
  import Ios from './components/IOS'
  import Android from './components/Android'
  import Web from './components/Web'
  import Wechat from './components/Wechat'
  import Promote from './components/Promote'
  import Modal from 'components/Modal'
  import _ from 'lodash'

  export default {
    name: 'Data',

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
      'v-select': Select,
      Modal,
      Ios,
      Android,
      Web,
      Wechat,
      Promote
    },

    data () {
      return {
        // 正在加载列表
        loadingData: false,
        // 显示添加浮层
        showAddModal: false,
        // 显示密钥浮层
        showSecretModal: false,
        // 正在添加应用
        adding: false,
        // 已选择的tab 1为应用配置 2为升级管理
        selectedTabIndex: 1,
        // 添加应用浮层
        addModal: {
          name: '',
          type: 1
        },
        // 应用类型
        appTypes: [
          {
            name: 'IOS',
            type: 1
          },
          {
            name: 'Android',
            type: 2
          },
          {
            name: 'Web',
            type: 3
          },
          {
            name: '微信',
            type: 4
          }
        ],
        // 已经选择的过滤条件
        selectedFilter: {},
        // 过滤条件
        filterOptions: [
          {
            name: '全部',
            type: 0
          },
          {
            name: 'IOS',
            type: 1
          },
          {
            name: 'Android',
            type: 2
          },
          {
            name: 'Web',
            type: 3
          }
        ],
        selectedApp: {},
        // 应用列表
        apps: [
          // {
          //   id: '2e07d2ad3c33aa00',
          //   name: 'test',
          //   create_time: '2016-01-19T19:26:57.00Z',
          //   enable: false,
          //   config: {
          //     apn: {
          //     },
          //     secret: 'BfnErEKgguL2uUxYmaZfuIzca0ylRrlt',
          //     type: 1,
          //     plugin: 'ios'
          //   },
          //   secret: 'BfnErEKgguL2uUxYmaZfuIzca0ylRrlt',
          //   type: 1,
          //   plugin: 'ios'
          // }
        ]
      }
    },

    computed: {
      /**
       * 计算组件名字
       * @return {[type]} [description]
       */
      componentName () {
        var result = ''
        if (this.selectedTabIndex === 1) {
          switch (this.selectedApp.type) {
            case 1:
              result = 'ios'
              break
            case 2:
              result = 'android'
              break
            case 3:
              result = 'web'
              break
            case 4:
              result = 'wechat'
              break
            default:
              break
          }
        } else {
          result = 'promote'
        }
        return result
      },
      /**
       * 过滤后的应用列表
       * @return {[type]} [description]
       */
      appList () {
        var filter = this.selectedFilter
        var result = []
        this.apps.forEach((item) => {
          if (item.type === filter.type || filter.type === 0) {
            result.push(item)
          }
        })
        return result
      }
    },

    route: {
      data () {
        this.getApps()
      }
    },

    ready () {
      this.init()
    },
    methods: {
      init () {
        this.selectedFilter = this.filterOptions[0]
      },
      /**
       * 显示密钥
       * @return {[type]} [description]
       */
      showSecret () {
        this.showSecretModal = true
      },
      /**
       * 获取 APP 列表
       * @return {[type]} [description]
       */
      getApps () {
        this.loadingData = true
        api.plugin.all().then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.apps = _.filter(res.data.list, (item) => {
              return item.type !== 10
            })
            this.resetSelectedApp()
          }
        })
      },

      /**
       * 过滤条件改变
       * @return {[type]} [description]
       */
      resetSelectedApp () {
        var selectedAppInAppList = false
        this.appList.forEach((item) => {
          if (item.id === this.selectedApp.id) {
            selectedAppInAppList = true
            this.selectedApp = item
          }
        })
        if (!selectedAppInAppList) {
          this.selectedApp = this.appList[0]
        }
      },

      /**
       * 表单提交
       * @return {[type]} [description]
       */
      onAddSubmit () {
        console.log('表单提交')
        if (true) {
          if (this.addModal.type === 1) { // iOS应用
            this.addModal.plugin = 'ios'
          } else if (this.addModal.type === 2) { // 安卓应用
            this.addModal.plugin = 'android'
          } else if (this.addModal.type === 3) { // web应用
            this.addModal.plugin = 'web'
          } else if (this.addModal.type === 4) { // 微信应用
            this.addModal.plugin = 'wechat'
          }
          this.adding = true
          api.plugin.create(this.addModal).then((res) => {
            if (res.status === 200) {
              this.createPlugin(res.data)
              this.onAddCancel()
              this.getApps()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
        // setTimeout(() => {
        //   this.onAddCancel()
        // }, 2000)
      },
      /**
       * 添加浮层的取消事件
       * @return {[type]} [description]
       */
      onAddCancel () {
        this.showAddModal = false
        this.adding = false
        this.addModal = {
          name: '',
          type: 1
        }
      },
      formatDate (date) {
        return formatDate(date)
      },
      computedAppType (num) {
        var result = ''
        switch (num) {
          case 1:
            result = 'IOS'
            break
          case 2:
            result = 'Android'
            break
          case 3:
            result = 'Web'
            break
          case 4:
            result = '微信'
            break
        }
        return result
      }

    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  // 视图淡入淡出
  .view-transition
    transition transform .3s ease-in-out, opacity .3s ease-in-out

  .view-enter
  .view-leave
    opacity 0
    transform translate3d(10px, 0, 0)

  .radio-group-v
    .app-type-radio
      margin-right 0
  .panel
    margin-top 15px
    height 100%
  .apps-container
    position relative
    width 100%
    height 100%
    .app-list-box
      width 230px
      height auto
      position absolute
      left 0
      top 0
      z-index 1
      .app
        width 100%
        height 60px
        background #f2f2f2
        border 1px solid #ddd
        border-right 0
        margin-bottom 3px
        box-sizing border-box
        padding 10px 20px
        position relative
        &.selected
          background #fff
          &:after
            content ""
            display block
            position absolute
            right -2px
            top 0
            width 3px
            height 100%
            background #fff
      .app-name
        height 22px
        font-size 14px
        text-overflow 100%
      .app-type
        color #BCBCBC
        font-size 13px
        text-overflow 100%
    .app-details-box
      height 100%
      margin-left 230px
      border 1px solid #ddd
      min-height 500px
      padding 20px 35px
      box-sizing border-box
      .app-name
        font-size 22px
        height 40px
        line-height 40px
      .app-msg
        font-size 12px
        color #666
</style>
