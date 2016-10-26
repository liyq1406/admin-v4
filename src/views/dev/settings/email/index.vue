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
import Tab from 'components/Tab'
import { globalMixins } from 'src/mixins'

export default {
  name: 'email',

  mixins: [globalMixins],

  components: {
    Tab
  },

  data () {
    return {
      secondaryNav: [{
      //   label: '自定义邮件',
      //   link: { path: '/dev/settings/email/customize' }
      // }, {
        label: '云智易模版设置',
        link: { path: '/dev/settings/email/template' }
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
