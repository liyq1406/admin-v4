<template>
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
</template>

<script>
  import Tab from 'components/Tab'
  // import api from 'api'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Device',

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
        var deviceDetailRoot = `/operation/products/${this.$route.params.product_id}/devices/${this.$route.params.device_id}`
        return {
          secondaryNav: [{
            label: '设备状态',
            link: { path: `${deviceDetailRoot}/info` }
          }, {
            label: '历史数据',
            link: { path: `${deviceDetailRoot}/history` }
          }, {
            label: '告警信息',
            link: { path: `${deviceDetailRoot}/alerts` }
          }, {
            label: '远程诊断',
            link: { path: `${deviceDetailRoot}/diagnose` }
          }, {
            label: '用户信息',
            link: { path: `${deviceDetailRoot}/users` }
          }, {
            label: '维保记录',
            link: { path: `${deviceDetailRoot}/warranty` }
          }, {
            label: '经销商',
            link: { path: `${deviceDetailRoot}/dealers` }
          }]
        }
      }
    }
  }
</script>
