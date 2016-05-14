<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>帮助中心</h2>
        </div>
        <div class="panel-bd">
          <!-- <tab :nav="secondaryNav"></tab> -->
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from '../../../components/Tab'
  import { globalMixins } from '../../../mixins'
  import Alert from '../../../components/Alert'

  export default {
    name: 'Link',

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
            label: this.$t('ui.sub_nav.broadcast.add'),
            link: { path: '/plugins/broadcast/add' }
          },
          {
            label: this.$t('ui.sub_nav.broadcast.history'),
            link: { path: '/plugins/broadcast/history' }
          }]
        }
      }
    }
  }
</script>
