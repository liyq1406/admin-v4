<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>邮件设置</h2>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'email',
  components: {
  },

  data () {
    return {
      secondaryNav: [{
        label: '自定义邮件',
        link: { path: '/dev/settings/email/customize' }
      }, {
        label: '云智易模版设置',
        link: { path: '/dev/settings/email/template' }
      }]
    }
  },

  computed: {}
}
</script>

<style lang="stylus">
</style>
