<template>
  <section class="main-wrap">
    <div class="main device-details">
      <div class="breadcrumb"><a v-link="{path: '/products/' + $route.params.product_id + '/devices' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('ui.device.management') }}</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>设备详情</h2>
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
  // import api from 'api'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Device',

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
      data (transition) {
        return {
          secondaryNav: [{
            label: '设备信息',
            link: { path: '/products/' + this.$route.params.product_id + '/devices/' + this.$route.params.device_id + '/info' }
          }, {
            label: '历史数据',
            link: { path: '/products/' + this.$route.params.product_id + '/devices/' + this.$route.params.device_id + '/history' }
          }, {
            label: '告警信息',
            link: { path: '/products/' + this.$route.params.product_id + '/devices/' + this.$route.params.device_id + '/alerts' }
          }, {
            label: '用户信息',
            link: { path: '/products/' + this.$route.params.product_id + '/devices/' + this.$route.params.device_id + '/users' }
          }, {
            label: '维保记录',
            link: { path: '/products/' + this.$route.params.product_id + '/devices/' + this.$route.params.device_id + '/warranty' }
          }]
        }
      }
    }
  }
</script>
