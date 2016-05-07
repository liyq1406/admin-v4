<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>设备互联</h2>
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
            label: this.$t('sub_nav.link.devices_link'),
            link: { path: '/link/devices' }
          },
          {
            label: this.$t('sub_nav.link.nest_link'),
            link: { path: '/link/nest' }
          },
          {
            label: this.$t('sub_nav.link.echo'),
            link: { path: '/link/echo' }
          }]
        }
      }
    }
  }
</script>
