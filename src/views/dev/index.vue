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

export default {
  name: 'dev',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Sidebar,
    AlertBar
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all,
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
        alias: 'dev',
        url: '/dev',
        subs: []
      }
      let subs = MAIN_NAV.dev.subs
      // 概览
      result.subs.push(subs[0])

      // 产品开发标题
      result.subs.push({
        label: this.$t('dev.product_development'),
        type: 'title'
      })

      // 产品导航
      // const PRO_SUBS = ['info', 'debug', 'virtual-devices', 'alert', 'data-point', 'authorize']
      // 虚拟设备(功能没实现，暂时隐藏 2016-09-20)
      const PRO_SUBS = ['info', 'debug', 'alert', 'data-point', 'authorize']
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
