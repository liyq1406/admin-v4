<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>短信设置</h2>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'edit',
  components: {
  },

  data () {
    return {
      secondaryNav: [{
        label: '短信配置',
        link: { path: '/dev/settings/message/config' }
      }, {
        label: '自定义运营商',
        link: { path: '/dev/settings/message/custom-carrier' }
      }]
    }
  },

  computed: {}
}
</script>

<style lang="stylus">
</style>
