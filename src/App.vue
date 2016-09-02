<template>
  <div :class="{'auth-page':hasLayout('auth'), 'has-topbar':hasLayout('topbar'), 'has-sidebar':hasLayout('sidebar'), 'loading-resource':loading}" class="page-container">
    <template v-if="hasLayout('auth')">
      <header class="auth-header" transition="header" transition-mode="out-in">
        <div class="logo-auth">
          <a href="http://www.xlink.cn/"></a>
        </div>
      </header>
    </template>

    <!-- Start: 路由视图 -->
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- End: 路由视图 -->

    <template v-if="hasLayout('topbar')">
      <topbar></topbar>
    </template>

    <!-- Start: 错误模态窗口 -->
    <modal :show="isShowError" width="360px" @disapear="removeError" @dismiss="hideError">
      <template slot="body">
        <div class="error-msg">{{error.msg}}</div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" @click.prevent.stop="hideError">{{ $t("common.ok") }}</button>
        </div>
      </template>
    </modal>
    <!-- End: 错误模态窗口 -->

    <!-- Start: 通知信息 -->
    <toast :messages="notices"></toast>
    <!-- End: 通知信息 -->
  </div>
</template>

<script>
import store from 'store/index'
import { globalMixins } from './mixins'
import { removeError, hideError, setCurrentMember, setCorp } from './store/actions/system'
import { getAllProducts } from './store/actions/products'
import { createPlugin, getAllPlugin } from './store/actions/plugins'
import Vue from 'vue'
import api from './api'
import Modal from './components/Modal'
import Topbar from 'components/Topbar'
import Toast from './components/Toast'
import _ from 'lodash'

export default {
  name: 'App',

  components: {
    Modal,
    Toast,
    Topbar
  },

  mixins: [globalMixins],

  // 状态管理
  store,

  vuex: {
    getters: {
      layouts: ({ system }) => system.layouts,
      loading: ({ system }) => system.loading,
      error: ({ system }) => system.error,
      isShowError: ({ system }) => system.isShowError,
      notices: ({ system }) => system.notices,
      corp: ({ system }) => system.corp,
      currentMember: ({ system }) => system.currentMember,
      products: ({ products }) => products.all,
      plugins: ({ plugins }) => plugins.all
    },
    actions: {
      hideError,
      removeError,
      setCorp,
      setCurrentMember,
      getAllProducts,
      createPlugin,
      getAllPlugin
    }
  },

  data () {
    return {
      customApps: []
    }
  },

  watch: {
    layouts () {
      if (this.hasLayout('topbar')) {
        this.getMember()
        this.getProducts()
        this.getPlugins()
        this.getCorpInfo()
      }
    }
  },

  ready () {
    document.title = Vue.config.lang === 'zh-cn' ? '云智易物联平台' : 'Xlink IOT Platform'
    // 监听子组件的更新成员信息事件
    this.$on('update-member', (member) => {
      this.currUser = member
    })
  },

  methods: {
    /**
     * 获取企业信息
     * @author shengzhi
     */
    getCorpInfo () {
      api.corp.getCorpInfo().then((res) => {
        this.setCorp(res.data)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 判断是否是否包含某种布局
     * @param  {String}  layout 目标布局
     * @return {Boolean}
     */
    hasLayout (layout) {
      return _.findIndex(this.layouts, (item) => {
        return item === layout
      }) >= 0
    },

    getMember () {
      api.corp.getMember(window.localStorage.getItem('memberId')).then((res) => {
        this.setCurrentMember(res.data)
      }).catch((res) => {
        this.$route.router.go('/login')
      })
    },

    getProducts () {
      api.product.all().then((res) => {
        this.getAllProducts(res.data)
      }).catch((res) => {
        this.handleError(res)
      })
    },

    getPlugins () {
      api.plugin.all().then((res) => {
        if (res.status === 200) {
          this.getAllPlugin(res.data.list)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">
// 配置
@import 'assets/stylus/base'

.page-container
  size 100%

.page-in
  absolute left top 54px right bottom

.auth-page
  background url('assets/images/main_bg.jpg') no-repeat center top
  overflow-y auto

.auth-header
  position relative
  text-align center

  // Logo
  .logo-auth
    a
      display inline-block
      size 200px 100px
      background red url('assets/images/logo_auth.png') no-repeat
      background-size 200px 100px

.loading-resource
  cursor wait

// 主内容区
.main-wrap
  absolute top right bottom left 200px
  overflow auto

  /*.main
    padding 10px 5px 0*/

  .main
    background #FFF

// 主标题
.main-title
  background #FFF
  padding 10px 15px
  /*margin-bottom 5px*/
  box-sizing border-box
  clearfix()

  h2
    float left
    margin 0
    font-size 18px
    line-height 36px
    font-weight normal

  .filter-bar
    padding 7px 0 0

  &.bordered
    border-bottom 1px solid default-border-color

  & + .x-breadcrumb
    margin-top -10px

// 视图淡入淡出
.view
.header
  transition transform .3s ease-in-out, opacity .3s ease-in-out

.view-enter
.view-leave
  opacity 0
  transform translate3d(10px, 0, 0)

// 头部淡入淡出
.header
.auth-header
  transition transform .2s ease-in-out .2s, opacity .2s ease-in-out .2s

.header-enter
.header-leave
  opacity 0
  transform translate3d(0, -10px, 0)
</style>
