<template>
  <div class="page-in">
    <sidebar :nav="type"></sidebar>

    <section class="main-wrap" v-if="showContent">
      <alert-bar :msg="alertMsg" v-if="!loading"></alert-bar>
      <!-- Start: 路由视图 -->
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      <!-- End: 路由视图 -->

      <!-- 内容遮罩 -->
      <div class="content-mask" v-if="!isDemo" v-show="!isHideMaskForever && !loading && isShowMask && (releasedProducts.length === 0 || corp.status === 0)"></div>
    </section>
  </div>
</template>

<script>
import Sidebar from 'components/other/layout/Sidebar'
import { MAIN_NAV, IS_DEMO } from 'consts/config'

export default {
  name: 'Operation',

  layouts: ['topbar', 'sidebar'],
  components: {
    Sidebar
  },

  vuex: {
    getters: {
      loading: ({ system }) => system.loading,
      isShowMask: ({ system }) => system.isShowMask,
      corp: ({ system }) => system.corp,
      releasedProducts: ({ products }) => products.released,
      plugins: ({ plugins }) => plugins.all,
      alertMsg: ({ system }) => system.alertMsg
    }
  },

  data () {
    return {
      isDemo: IS_DEMO,
      showContent: false,
      nav: {},
      userRole: window.localStorage.getItem('userRole'),
      config: window.localStorage.getItem('dealerConfig')
    }
  },

  computed: {
    // 判断侧边栏类型
    type () {
      if (this.userRole === 'member') {
        return this.secNav
      } else if (this.userRole === 'dealer') {
        return this.dealerSecNav
      } else if (this.userRole === 'heavy-buyer') {
        return this.vipSecNav
      }
    },
    // 经销商独立配置信息
    configInfo () {
      return JSON.parse(this.config)
    },
    // 是否不再显示警告遮罩
    isHideMaskForever () {
      return window.localStorage.getItem(`${this.corp.id}hideAlertMask`)
    },

    // 经销商侧栏导航
    dealerSecNav () {
      let result = {
        alias: 'operation',
        url: '/operation',
        subs: []
      }
      // let subs = MAIN_NAV.operation.subs

      // 产品管理标题
      result.subs.push({
        label: this.$t('operation.product_management'),
        type: 'title'
      })

      // 产品导航
      // const PRO_SUBS = ['overview', 'devices', 'alerts', 'device-map', 'analysis']
      var openArr = []
      var hashMap = {
        'summary': 'overview',
        'device_list': 'devices',
        'alert': 'alerts',
        'device_map': 'device-map',
        'analyse': 'analysis'
      }
      this.configInfo.module.forEach((mode) => {
        if (mode.is_visible) {
          openArr.push(hashMap[mode.type])
        }
      })
      // this.configInfo.module.forEach((mode) => {
      //   if (mode.type === 'summary' && mode.is_visible) {
      //     openArr.push('overview')
      //   } else if (mode.type === 'device_list' && mode.is_visible) {
      //     openArr.push('devices')
      //   } else if (mode.type === 'alert' && mode.is_visible) {
      //     openArr.push('alerts')
      //   } else if (mode.type === 'device_map' && mode.is_visible) {
      //     openArr.push('device-map')
      //   } else if (mode.type === 'analyse' && mode.is_visible) {
      //     openArr.push('analysis')
      //   }
      // })
      this.releasedProducts.forEach((item, index) => {
        result.subs.push({
          name: item.name,
          type: 'product',
          alias: 'products',
          icon: 'link',
          unfold: index === 0,
          id: item.id,
          subs: openArr.map((sub) => {
            return {
              alias: sub,
              url: `/products/${item.id}/${sub}`
            }
          })
        })
      })

      // result.subs.push({
      //   alias: 'settings',
      //   icon: 'cog',
      //   url: 'heavy-buyer-settings'
      // })

      return result
    },

    // 大客户侧栏导航
    vipSecNav () {
      let result = {
        alias: 'operation',
        url: '/operation',
        subs: []
      }
      // let subs = MAIN_NAV.operation.subs

      // 产品管理标题
      result.subs.push({
        label: this.$t('operation.product_management'),
        type: 'title'
      })

      // 产品导航
      const PRO_SUBS = ['overview', 'devices', 'alerts', 'device-map', 'analysis']
      this.releasedProducts.forEach((item, index) => {
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

      result.subs.push({
        alias: 'settings',
        icon: 'cog',
        url: 'heavy-buyer-settings'
      })

      return result
    },

    // 侧栏导航
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
        label: this.$t('operation.product_management'),
        type: 'title'
      })

      // 产品导航
      const PRO_SUBS = ['overview', 'devices', 'alerts', 'device-map', 'analysis']
      this.releasedProducts.forEach((item, index) => {
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
        label: this.$t('operation.product_service'),
        type: 'title'
      })

      // 其他固定导航
      result.subs = result.subs.concat(subs.slice(1, subs.length - 1))

      // 插件导航
      this.plugins.forEach((item) => {
        let sub = {
          // name: item.name,
          type: 'plugin',
          alias: item.plugin,
          id: item.id,
          icon: 'puzzle-piece',
          unfold: true, // 展开子级菜单?
          url: `plugins/${item.plugin}`
        }

        // 排除的插件 id
        let excluded = ['ios', 'android', 'wechat', 'ezviz', 'avs']

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
          case 'web': // Web
            sub.icon = 'internet-explorer'
            sub.label = item.name
            sub.url = item.config.url
            // sub.subs = [{
            //   alias: 'settings',
            //   url: `/plugins/web/${item.id}/settings`
            // }]
            break
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
            sub.subs = [{
              alias: 'list',
              url: `/plugins/dealer/${item.id}/list`
            }, {
              alias: 'analysis',
              url: `/plugins/dealer/${item.id}/analysis`
            }]
            break
          case 'operateposition': // 运营位管理
            sub.icon = 'newspaper-o'
            break
          case 'airquality': // 环境数据
            sub.icon = 'mixcloud'
            break
          case 'splashwnd': // 闪屏设置
            sub.icon = 'photo'
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
            sub.subs = [{
              alias: 'articles',
              url: `/plugins/content/${item.id}/articles`
            }, {
              alias: 'tags',
              url: `/plugins/content/${item.id}/tags`
            }]
            break
          default:
        }

        // 插件出现在侧栏的条件为：
        // 1: 不在指定的排除列表里面
        // 2：应用市场中状态为开启
        // 3：认证状态为已认证(2)或半认证(3)
        if (!exists(excluded, item.plugin) && item.enable && item.platform_status > 1) {
          result.subs.push(sub)
        }
      })

      // 最后的固定导航
      result.subs = result.subs.concat(subs.slice(-1))
      return result
    }
  },

  watch: {
    releasedProducts () {
      this.init()
    }
  },

  route: {
    data () {
      this.init()
    }
  },

  ready () {
    this.showContent = true
  },

  methods: {
    init () {
      if (this.$route.path === '/operation/overview') {
        if (!this.releasedProducts.length) {
          this.showAlertBar(this.locales.data.ALERT_MESSAGES['not_published'])
        } else {
          this.removeAlertBar()
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base'

// 内容遮罩
.content-mask
  fixed left top
  size 100%
  background rgba(0, 0, 0, .6)
  z-index 1000
</style>
