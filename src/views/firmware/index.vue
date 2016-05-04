<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>固件管理</h2>
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
  import Tab from '../../components/Tab'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Data',

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
            label: this.$t('sub_nav.firmware.overview'),
            link: { path: '/firmware/overview' }
          },
          {
            label: this.$t('sub_nav.firmware.management'),
            link: { path: '/firmware/management' }
          },
          {
            label: this.$t('sub_nav.firmware.update'),
            link: { path: '/firmware/update' }
          }]
        }
      }
    }
  }
</script>
