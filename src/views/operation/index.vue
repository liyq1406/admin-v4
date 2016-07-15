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
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      nav: {}
    }
  },

  computed: {
    secNav () {
      var result = {
        alias: 'operation',
        url: '/operation',
        subs: []
      }
      var subs = MAIN_NAV.operation.subs
      result.subs.push(subs[0])
      this.products.forEach((item) => {
        result.subs.push({
          name: item.name,
          alias: 'products',
          icon: 'link',
          id: item.id,
          subs: [{
            alias: 'overview',
            url: `/products/${item.id}/overview`
          }, {
            alias: 'devices',
            url: `/products/${item.id}/devices`
          }, {
            alias: 'alerts',
            url: `/products/${item.id}/alerts`
          }, {
            alias: 'device_map',
            url: `/products/${item.id}/device-map`
          }, {
            alias: 'distributing',
            url: `/products/${item.id}/distributing`
          }, {
            alias: 'addon',
            url: `/products/${item.id}/addon`
          }]
        })
      })
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
