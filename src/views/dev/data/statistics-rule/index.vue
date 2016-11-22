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
export default {
  name: 'statistics-rule',
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
</style>
