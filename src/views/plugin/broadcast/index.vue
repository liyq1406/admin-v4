<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>消息推送</h2>
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
  import Tab from '../../../components/Tab'
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'Link',

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
            label: this.$t('ui.sub_nav.broadcast.add'),
            link: { path: `/plugins/broadcast/${this.$route.params.app_id}/add` }
          },
          {
            label: this.$t('ui.sub_nav.broadcast.history'),
            link: { path: `/plugins/broadcast/${this.$route.params.app_id}/history` }
          }]
        }
      }
    }
  }
</script>
