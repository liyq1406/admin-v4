<template>
  <div class="main device-details">
    <div class="breadcrumb"><a v-link="{path: '/products/' + $route.params.product_id + '/devices' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('ui.device.management') }}</a></div>
    <div class="panel">
      <div class="panel-hd">
        <h2>设备详情</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-24">
            <div class="panel">
              <div class="panel-bd row">
                <div class="col-18">
                  <ul class="device-details">
                    <li v-if="device.name">
                      <div class="label">设备名称:</div>
                      <div class="info">{{ device.name }}</div>
                    </li>
                    <li>
                      <div class="label">ID:</div>
                      <div class="info">{{ device.id }}</div>
                    </li>
                    <li>
                      <div class="label">MAC:</div>
                      <div class="info">{{ device.mac }}</div>
                    </li>
                    <li>
                      <div class="label">{{ $t('ui.device.is_active') }}:</div>
                      <div class="info">{{ device.is_active ? $t('ui.device.active') : $t('ui.device.not_active') }}</div>
                    </li>
                    <li>
                      <div class="label">{{ $t('ui.device.active_date') }}:</div>
                      <div class="info">{{ device.active_date | formatDate }}</div>
                    </li>
                    <li>
                      <div class="label">{{ $t('ui.device.is_online') }}:</div>
                      <div class="info"><span v-if="device.is_online" class="hl-green">{{ $t('common.online') }}</span><span v-else class="hl-red">{{ $t('common.offline') }}</span></div>
                    </li>
                    <li>
                      <div class="label">{{ $t('ui.device.firmware_version') }}:</div>
                      <div class="info"><span>{{ device.firmware_version }}</span></div>
                    </li>
                    <li>
                      <div class="label">所属经销商</div>
                      <div class="info"><span>华南-广州总部</span></div>
                    </li>
                  </ul>
                </div>
                <div class="col-6 device-map with-loading">
                  <div class="icon-loading" v-show="loadingData">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div id="device-map" class="mt20" style="height: 192px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
  import Tab from 'components/Tab'
  // import CrumbNav from 'components/CrumbNav'
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
        secondaryNav: [],
        Cnav: []
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
