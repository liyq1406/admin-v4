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

    <!-- 内容遮罩 -->
    <div class="content-mask hidden"></div>

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
import { API_SERVER } from 'consts/config'

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
      refreshed: false,
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
    // this.refreshToken()
    document.title = Vue.config.lang === 'zh-cn' ? '云智易物联平台' : 'Xlink IOT Platform'
    // 监听子组件的更新成员信息事件
    this.$on('update-member', (member) => {
      this.currUser = member
    })
  },

  methods: {
    /**
     * 刷新token
     * @return {[type]} [description]
     */
    refreshToken () {
      // 定义需要刷新与否的标志位 默认是true
      let needRefresh = true
      // 定义常量 不需要刷新token的页面
      const NOREFRESHPATH = ['/login', '/register', '/fetch', '/forbidden', '/password-reset', '/member-activate', '/email-activate', '/user-password-reset', '/user-email-activate']
      // 判断当前页面是否需要刷新
      for (let i = 0; i < NOREFRESHPATH.length; i++) {
        let reg = new RegExp(`^${NOREFRESHPATH[i]}`)
        if (reg.test(this.$route.path)) {
          needRefresh = false
          break
        }
      }
      // 如果不需要刷新 直接return
      if (!needRefresh) return
      // 刷新token逻辑
      this.refreshed = false
      var params = {
        'refresh_token': window.localStorage.getItem('refreshToken')
      }
      var xmlhttp = new window.XMLHttpRequest()
      xmlhttp.open('POST', `${API_SERVER.default}/v2/corp/token/refresh`, false) // 这里的false表示同步
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xmlhttp.setRequestHeader('Access-Token', window.localStorage.getItem('accessToken'))
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          let res = {}
          res.status = xmlhttp.status
          res.data = JSON.parse(xmlhttp.responseText)
          let today = new Date()
          window.localStorage.setItem('accessToken', res.data.access_token)
          window.localStorage.setItem('refreshToken', res.data.refresh_token)
          window.localStorage.setItem('expireIn', res.data.expire_in)
          window.localStorage.setItem('expireAt', today.getTime() + res.data.expire_in * 1000)
          window.localStorage.removeItem('pluginsToken')
        }
        this.refreshed = true
      }
      xmlhttp.send(JSON.stringify(params))
    },
    /**
     * 获取企业信息
     * @author shengzhi
     */
    getCorpInfo () {
      api.corp.getCorpInfo().then((res) => {
        this.setCorp(res.data)
      }).catch((res) => {
        // this.handleError(res)
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

    // TODO token失效问题
    getMember () {
      api.corp.getMember(window.localStorage.getItem('memberId')).then((res) => {
        this.setCurrentMember(res.data)
        window.localStorage.memberRole = res.data.role
      }).catch((res) => {
        // this.showNotice({
        //   type: 'error',
        //   content: '暂无当前用户信息'
        // })
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

// 内容遮罩
.content-mask
  fixed left top
  size 100%
  background rgba(0, 0, 0, .6)
  z-index 200

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
