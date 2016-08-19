<template>
  <div class="page-in">
    <section class="main-wrap">
      <!-- Start: 路由视图 -->
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      <!-- End: 路由视图 -->
    </section>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Account',

  layouts: ['topbar', 'account-sidebar'],

  mixins: [globalMixins],

  components: {
  },

  data () {
    return {
      nav: [{
      }]
    }
  },

  ready () {
  }
}
</script>
