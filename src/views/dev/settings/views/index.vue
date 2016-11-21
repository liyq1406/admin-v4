<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>视图自定义</h2>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'views',
  components: {
  },

  data () {
    return {
      secondaryNav: [{
      //   label: '字段设置',
      //   link: { path: '/dev/settings/views/field' }
      // }, {
        label: '自定义产品概览',
        link: { path: '/dev/settings/views/overview' }
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
