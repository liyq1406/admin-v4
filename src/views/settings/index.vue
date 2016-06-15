<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("ui.nav_aside.settings") }}</h2>
        </div>
        <div class="panel-bd">
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from 'components/Tab'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Settings',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'tab': Tab
    },

    data () {
      return {
        secondaryNav: []
      }
    },

    route: {
      data () {
        return {
          secondaryNav: [{
            label: this.$t('ui.sub_nav.settings.auth'),
            link: { path: '/settings/auth' }
          }, {
            label: this.$t('ui.sub_nav.settings.members'),
            link: { path: '/settings/members' }
          }, {
            label: this.$t('ui.sub_nav.settings.account'),
            link: { path: '/settings/account' }
          }, {
            label: this.$t('ui.sub_nav.settings.mail_templates'),
            link: { path: '/settings/mail-templates' }
          }]
        }
      }
    }
  }
</script>
