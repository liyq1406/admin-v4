<template>
  <div class="page-in">
    <sidebar :nav="secNav"></sidebar>

    <section class="main-wrap">
      <!-- <pre>
        {{ subs | json}}
      </pre> -->
      <!-- Start: 路由视图 -->
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      <!-- End: 路由视图 -->
    </section>
  </div>
</template>

<script>
import Sidebar from 'components/Sidebar'
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
    Sidebar
  },

  store,

  vuex: {
    getters: {
      products: ({ products }) => products.all,
      plugins: ({ plugins }) => plugins.all
    }
  },

  data () {
    return {
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

      // 产品导航
      const PRO_SUBS = ['overview', 'devices', 'alerts', 'device-map', 'distributing', 'analysis']
      this.products.forEach((item) => {
        result.subs.push({
          name: item.name,
          type: 'product',
          alias: 'products',
          icon: 'link',
          id: item.id,
          subs: PRO_SUBS.map((sub) => {
            return {
              alias: sub,
              url: `/products/${item.id}/${sub}`
            }
          })
        })
      })

      // 插件导航
      this.plugins.forEach((item) => {
        let sub = {
          name: item.name,
          type: 'plugin',
          alias: item.plugin,
          id: item.id,
          icon: 'puzzle-piece',
          url: `plugins/${item.plugin}`
        }
        switch (item.plugin) {
          case 'ios': // iOS
            sub.icon = 'apple'
            sub.subs = [{
              alias: 'settings',
              url: `/plugins/ios/${item.id}/settings`
            }]
            break
          case 'android': // Android
            sub.icon = 'android'
            sub.subs = [{
              alias: 'settings',
              url: `/plugins/android/${item.id}/settings`
            }, {
              alias: 'version',
              url: `/plugins/android/${item.id}/version`
            }]
            break
          case 'web': // Web
            sub.icon = 'internet-explorer'
            sub.subs = [{
              alias: 'settings',
              url: `/plugins/web/${item.id}/settings`
            }]
            break
          case 'wechat': // Wechat
            sub.icon = 'wechat'
            sub.subs = [{
              alias: 'settings',
              url: `/plugins/wechat/${item.id}/settings`
            }]
            break
          case 'recipe': // 云菜谱
            sub.icon = 'cutlery'
            break
          case 'warranty': // 在线维保
            sub.icon = 'support'
            sub.subs = [{
              alias: 'overview',
              url: `/plugins/warranty/${item.id}/overview`
            }, {
              alias: 'extended_warranties',
              url: `/plugins/warranty/${item.id}/work-orders/extended-warranties`
            }, {
              alias: 'repair',
              url: `/plugins/warranty/${item.id}/work-orders/repair`
            }, {
              alias: 'accounts',
              url: `/plugins/warranty/${item.id}/accounts`
            }, {
              alias: 'heat',
              url: `/plugins/warranty/${item.id}/heat`
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
            }]
            break
          case 'dealer': // 经销商管理
            sub.icon = 'sitemap'
            sub.subs = [{
              alias: 'list',
              url: `/plugins/dealer/${item.id}/list`
            }]
            break
          case 'nest': // Google Nest网关
            sub.icon = 'google'
            break
          case 'xpay': // 支付网关
            sub.icon = 'credit-card'
            break
          case 'content': // 内容管理

            break
          default:
        }
        if (Object.keys(sub).length) {
          result.subs.push(sub)
        }
      })

      // 其他导航
      result.subs = result.subs.concat(subs.slice(1, subs.length))
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
