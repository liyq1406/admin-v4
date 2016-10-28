<template>
  <!-- Start: 侧栏 -->
  <!-- <section class="sidebar" transition="sidebar" transition-mode="out-in"> -->
  <section class="sidebar">
    <div class="nav-aside">
      <div class="nav-aside-wrap">
        <div class="nav-aside-content">
          <div class="nav-aside-item" v-for="item in subs">
            <template v-if="item.type === 'title' || item.action">
              <!-- 小标题 -->
              <div class="nav-aside-title" v-if="item.type === 'title'">{{ item.label }} </div>
              <!-- 按钮 -->
              <div class="nav-aside-actions" v-if="item.action">
                <a v-link="{path: nav.url + item.url}"><i class="fa" :class="'fa-'+item.icon"></i>{{ $t('layout.main_nav.dev.subs.add_product') }}</a>
              </div>
            </template>
            <!-- 导航菜单 -->
            <template v-else>
              <a class="nav-aside-item-title" :href="genTopLevelLink(item)" @click="toggle(item, $event)" :class="{'v-link-active':isActive(item)}"><i class="fa" :class="'fa-'+item.icon"></i>{{ item.name || $t('layout.main_nav.' + nav.alias + '.subs.' + item.alias + '.label') }}</a>
              <ul class="sub-nav" v-show="item.subs && item.subs.length && item.unfold">
                <li v-for="link in item.subs"><a v-link="{path: nav.url + link.url}"><span class="link-text">{{ $t('layout.main_nav.' + nav.alias + '.subs.' + item.alias + '.subs.' + strikeToLodash(link.alias)) }}</span></a></li>
              </ul>
            </template>
          </div>
          <!-- End: 插件管理 -->
          <!-- <div class="nav-aside-item"><a v-link="{ path: '/alerts' }"><i class="fa fa-bell"></i>{{ $t("ui.subs.alerts") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/linkage' }"><i class="fa fa-clone"></i>{{ $t("ui.subs.linkage") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/data' }"><i class="fa fa-database"></i>{{ $t("ui.subs.data") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/users' }"><i class="fa fa-users"></i>{{ $t("ui.subs.users") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/device-map' }"><i class="fa fa-map"></i>{{ $t("ui.subs.device_map") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/firmware' }"><i class="fa fa-rocket"></i>{{ $t("ui.subs.firmwares") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/statistic' }"><i class="fa fa-bar-chart"></i>{{ $t("ui.subs.statistic") }}</a></div>
          <div class="nav-aside-item"><a v-link="{ path: '/settings' }"><i class="fa fa-cog"></i>{{ $t("ui.subs.settings") }}</a></div> -->
        </div>
      </div>
    </div>
  </section>
  <!-- End: 侧栏 -->
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Sidebar',

  props: {
    nav: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      subs: []
    }
  },

  watch: {
    nav () {
      this.init()
    }
  },

  // computed: {
  //   subs () {
  //     var result = this.nav.subs
  //     result.forEach((item, index) => {
  //       var reg = new RegExp(`${this.nav.url}/${item.alias}`, 'i')
  //       result.$set(index, _.assign({}, item, {unfold: reg.test(this.$route.path)}))
  //     })
  //     return result
  //   }
  // },
  ready () {
    this.init()
  },

  methods: {
    init () {
      var result = this.nav.subs
      result.forEach((item, index) => {
        var reg
        if (item.type === 'product') {
          reg = new RegExp(`${this.nav.url}/${item.alias}/${item.id}`, 'i')
        } else if (item.type === 'plugin') {
          reg = new RegExp(`${this.nav.url}/plugins/${item.alias}/${item.id}`, 'i')
        } else {
          reg = new RegExp(`${this.nav.url}/${item.alias}`, 'i')
        }
        result.$set(index, _.assign({}, item, {unfold: item.unfold || reg.test(this.$route.path)}))
      })
      this.subs = result
    },

    /**
     * 生成顶级链接地址
     */
    genTopLevelLink (link) {
      let result = `/#!${this.nav.url}/${link.url || link.alias}${link.id ? '/' + link.id : ''}`

      let reg = /^http/
      if (reg.test(link.url)) {
        result = link.url
      }

      return result
    },

    /**
     * 判断链接是否激活
     */
    isActive (link) {
      if (this.genTopLevelLink(link)) {
        link = this.genTopLevelLink(link).split('/#!')[1]
        let path = this.$route.path
        let reg = new RegExp(link, 'i')
        return reg.test(path)
      }
      return false
    },

    /**
     * 中划线转下划线
     * @param  {String} val  目标值
     * @return {String}
     */
    strikeToLodash (val) {
      return val.replace(/-/g, '_')
    },

    toggle (nav, e) {
      if (nav.subs && nav.subs.length) {
        e.preventDefault()
        nav.unfold = !nav.unfold
        return
      }
      var path = this.genTopLevelLink(nav)
      let reg = /^http/
      if (reg.test(path)) {
        e.preventDefault()
        window.open(path)
      }
    }
  }
}
</script>

<style lang="stylus">
// 配置
@import '../assets/stylus/base'

// 侧栏
.sidebar
  absolute left top
  size 199px 100%
  background #F2F2F2
  border-right 1px solid #ECECEC
  z-index 1000

// 侧栏导航
.nav-aside
  height 100%
  box-sizing border-box
  overflow hidden

.nav-aside-wrap
  size 230px 100%
  overflow-y auto

.nav-aside-content
  width 200px
  padding-top 10px

.nav-aside-item
  margin-bottom 10px

  a
    text-decoration none

  & > .nav-aside-item-title
    display block
    color #616161
    height 40px
    line-height 40px
    padding-right 14px
    padding-left 20px
    /*background #202020*/
    transition background .2s ease
    overflow hidden
    white-space nowrap
    text-overflow "…"
    cursor pointer

    .fa
      font-size 16px
      width 20px
      margin-right 12px

    &:hover
      background #E5E5E5
      text-decoration none

    &.v-link-active
      padding-left 16px
      border-left 4px solid red

  ul
    border-left 4px solid transparent
    border-right 4px solid transparent

  li
    & > a
      display block
      padding 5px 10px 5px 0
      transition background .2s ease

      span
        margin-left 60px

      &:hover
        background #E5E5E5
        color #616161

    & > .v-link-active
      font-weight bold
      color red

      &:hover
        color red

.nav-aside-group
  margin-top 20px

  h3
    margin 0
    padding-left 20px
    font-size 14px
    line-height 32px
    color #525252

.nav-aside-actions
  margin 5px 20px 30px

  a
    display block
    height 34px
    line-height 34px
    border 1px dashed #525252
    border-radius 2px
    text-align center
    color #525252

    .fa
      margin-right 10px

    &:hover
      background-color #E5E5E5
      text-decoration none

.nav-aside-title
  margin-top 25px
  color gray-light
  padding-left 20px

// 侧栏淡入淡出
/*.sidebar
  transition transform .2s ease-in-out 1s, opacity .2s ease-in-out 1s

.sidebar-enter
.sidebar-leave
  opacity 0
  transform translate3d(-10px, 0, 0)*/
</style>
