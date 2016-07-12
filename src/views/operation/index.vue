<template>
  <div class="page-in">
    <sidebar :nav="secNav"></sidebar>

    <section class="main-wrap">
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
// import _ from 'lodash'

export default {
  name: 'Dashboard',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Sidebar
  },

  data () {
    return {
      secNav: {}
    }
  },

  ready () {
    var nav = MAIN_NAV.operation
    nav.subs.map((item) => {
      var reg = new RegExp(`${nav.url}/${item.alias}`, 'i')
      item.unfold = reg.test(this.$route.path)
      return item
    })
    this.secNav = nav
  }
}
</script>
