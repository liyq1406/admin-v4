<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>用户反馈</h2>
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
  import Alert from 'components/Alert'

  export default {
    name: 'Helpdesk',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-alert': Alert,
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
            label: this.$t('ui.sub_nav.helpdesk.overview'),
            link: { path: `/plugins/helpdesk/${this.$route.params.app_id}/overview` }
          }, {
            label: this.$t('ui.sub_nav.helpdesk.issues'),
            link: { path: `/plugins/helpdesk/${this.$route.params.app_id}/issues` }
          }, {
            label: this.$t('ui.sub_nav.helpdesk.tags'),
            link: { path: `/plugins/helpdesk/${this.$route.params.app_id}/tags` }
          }]
        }
      }
    }
  }
</script>
