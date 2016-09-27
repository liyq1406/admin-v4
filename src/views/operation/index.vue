<template>
  <div class="page-in">
    <sidebar :nav="secNav"></sidebar>

    <section class="main-wrap" v-if="showContent">
      <alert-bar :msg="alertMsg"></alert-bar>
      <!-- Start: 路由视图 -->
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      <!-- End: 路由视图 -->
    </section>
  </div>
</template>

<script>
import Sidebar from 'components/Sidebar'
import AlertBar from 'components/AlertBar'
import { globalMixins } from 'src/mixins'
import { MAIN_NAV } from 'consts/config'
// import api from 'api'
// import _ from 'lodash'
import store from 'store/index'

export default {
  name: 'Operation',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Sidebar,
    AlertBar
  },

  store,

  vuex: {
    getters: {
      products: ({ products }) => products.released,
      plugins: ({ plugins }) => plugins.all,
      alertMsg: ({ system }) => system.alertMsg
    }
  },

  data () {
    return {
      showContent: false,
      nav: {}
    }
  },

  computed: {
    secNav () {
      let result = {
        alias: 'operation',
        url: '/operation',
        subs: []
      }
      let subs = MAIN_NAV.operation.subs
      // 概览
      result.subs.push(subs[0])

      // 产品管理标题
      result.subs.push({
        label: '产品管理',
        type: 'title'
      })

      // 产品导航
      const PRO_SUBS = ['overview', 'devices', 'alerts', 'device-map', 'analysis']
      this.products.forEach((item, index) => {
        result.subs.push({
          name: item.name,
          type: 'product',
          alias: 'products',
          icon: 'link',
          unfold: index === 0,
          id: item.id,
          subs: PRO_SUBS.map((sub) => {
            return {
              alias: sub,
              url: `/products/${item.id}/${sub}`
            }
          })
        })
      })

      // 产品服务标题
      result.subs.push({
        label: '产品服务',
        type: 'title'
      })

      // 其他固定导航
      result.subs = result.subs.concat(subs.slice(1, subs.length))

      // 插件导航
      this.plugins.forEach((item) => {
        let sub = {
          name: item.name,
          type: 'plugin',
          alias: item.plugin,
          id: item.id,
          icon: 'puzzle-piece',
          unfold: true, // 展开子级菜单?
          url: `plugins/${item.plugin}`
        }

        // 排除的插件 id
        let excluded = ['ios', 'android', 'wechat', 'ezviz']

        /**
         * 判断数组是否存在某个值
         * @param  {Array} arr  目标数组
         * @param  {String} key 目标值
         * @return {Boolean}
         */
        let exists = (arr, key) => {
          let result = false
          arr.forEach((item) => {
            if (item === key) {
              result = true
            }
          })
          return result
        }

        switch (item.plugin) {
          // 用户自定义 iOS 插件不予展示在侧栏
          // case 'ios': // iOS
          //   sub.icon = 'apple'
          //   sub.subs = [{
          //     alias: 'settings',
          //     url: `/plugins/ios/${item.id}/settings`
          //   }]
          //   break

          // 用户自定义 iOS 插件不予展示在侧栏
          // case 'android': // Android
          //   sub.icon = 'android'
          //   sub.subs = [{
          //     alias: 'settings',
          //     url: `/plugins/android/${item.id}/settings`
          //   }, {
          //     alias: 'version',
          //     url: `/plugins/android/${item.id}/version`
          //   }]
          //   break

          case 'web': // Web
            sub.icon = 'internet-explorer'
            sub.label = item.name
            sub.url = item.config.url
            // sub.subs = [{
            //   alias: 'settings',
            //   url: `/plugins/web/${item.id}/settings`
            // }]
            break

          // 用户自定义微信插件不予展示在侧栏
          // case 'wechat': // Wechat
          //   sub.icon = 'wechat'
          //   sub.subs = [{
          //     alias: 'settings',
          //     url: `/plugins/wechat/${item.id}/settings`
          //   }]
          //   break

          case 'recipe': // 云菜谱
            sub.icon = 'cutlery'
            sub.alias = 'recipes'
            sub.subs = [{
              alias: 'recipes',
              url: `/plugins/recipes/${item.id}/recipes`
            }, {
              alias: 'menus',
              url: `/plugins/recipes/${item.id}/menus`
            }, {
              alias: 'categories',
              url: `/plugins/recipes/${item.id}/categories`
            }, {
              alias: 'tags',
              url: `/plugins/recipes/${item.id}/tags`
            // 暂时隐藏
            // }, {
            //   alias: 'heat',
            //   url: `/plugins/warranty/${item.id}/heat`
            }]
            break
          case 'warranty': // 智能维保
            sub.icon = 'support'
            sub.subs = [{
            //   alias: 'overview',
            //   url: `/plugins/warranty/${item.id}/overview`
            // }, {
              alias: 'repair',
              url: `/plugins/warranty/${item.id}/work-orders/repair`
            }, {
              alias: 'extended_warranties',
              url: `/plugins/warranty/${item.id}/work-orders/extended-warranties`
            }, {
              alias: 'accounts',
              url: `/plugins/warranty/${item.id}/accounts`
            }, {
              alias: 'settings',
              url: `/plugins/warranty/${item.id}/settings`
            // 暂时隐藏
            // }, {
            //   alias: 'heat',
            //   url: `/plugins/warranty/${item.id}/heat`
            }]
            break
          case 'broadcast': // 消息推送
            sub.icon = 'envelope'
            sub.subs = [{
              alias: 'add',
              url: `/plugins/broadcast/${item.id}/add`
            }, {
              alias: 'list',
              url: `/plugins/broadcast/${item.id}/list`
            }]
            break
          case 'helpdesk': // 用户反馈
            sub.icon = 'inbox'
            sub.subs = [{
              alias: 'overview',
              url: `/plugins/helpdesk/${item.id}/overview`
            }, {
              alias: 'issues',
              url: `/plugins/helpdesk/${item.id}/issues`
            }, {
              alias: 'settings',
              url: `/plugins/helpdesk/${item.id}/settings`
            }]
            break
          case 'dealer': // 经销商管理
            sub.icon = 'sitemap'
            // sub.alias = 'list'
            // sub.url = `plugins/dealer/${item.id}/list`
            sub.subs = [{
              alias: 'list',
              url: `/plugins/dealer/${item.id}/list`
            }]
            break
          case 'splashwnd': // 闪屏设置
            sub.icon = 'inbox'
            sub.subs = [{
              alias: 'list',
              url: `/plugins/splashwnd/${item.id}/list`
            }]
            break
          case 'nest': // Google Nest网关
            sub.icon = 'google'
            break
          case 'xpay': // 支付网关
            sub.icon = 'credit-card'
            break
          case 'content': // 内容管理
            sub.alias = 'content'
            sub.icon = 'newspaper-o'
            sub.url = 'plugins/content'
            break
          default:
        }
        if (!exists(excluded, item.plugin) && item.enable) {
          result.subs.push(sub)
        }
      })

      // console.log(subs.slice(1, subs.length))
      // this.nav.subs.forEach((item, index) => {
      //   var reg = new RegExp(`${result.url}/${item.alias}`, 'i')
      //   this.nav.subs.$set(index, _.assign({}, item, {unfold: reg.test(this.$route.path)}))
      // })
      // reuslt.subs.forEach((item, index) => {
      //   var reg = new RegExp(`${this.secNav.url}/${item.alias}`, 'i')
      //   this.secNav.subs.$set(index, _.assign({}, item, {unfold: reg.test(this.$route.path)}))
      // })
      return result
    }
  },

  ready () {
    this.showContent = true
    // var subs = []
    // subs.push(MAIN_NAV.operation.subs[0])
    // console.log(this.subs)
    //
    // this.nav = MAIN_NAV.operation
    // this.secNav.subs.forEach((item, index) => {
    //   var reg = new RegExp(`${this.secNav.url}/${item.alias}`, 'i')
    //   this.secNav.subs.$set(index, _.assign({}, item, {unfold: reg.test(this.$route.path)}))
    // })
  }
}
</script>
