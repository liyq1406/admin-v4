<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>统计规则</h2>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'statistics-rule',

  mixins: [globalMixins],

  components: {
  },

  data () {
    return {
      secondaryNav: [{
        label: '设备统计',
        link: { path: '/dev/data/statistics-rule/device' }
      }, {
        label: '产品统计',
        link: { path: '/dev/data/statistics-rule/product' }
      }]
    }
  },

  computed: {}
}
</script>

<style lang="stylus">
  .main .x-breadcrumb
    border-bottom 0
</style>
