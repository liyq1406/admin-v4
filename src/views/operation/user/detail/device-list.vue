<template>
  <div class="panel">
    <div class="panel-hd">
      <h2>{{ $t('ui.user.devices_bound') }}</h2>
    </div>
    <div class="panel-bd">
      <table class="table table-stripe table-bordered">
        <thead>
          <tr>
            <th>{{ $t('ui.user.product_name') }}</th>
            <th>{{ $t('ui.user.device_mac') }}</th>
            <th>{{ $t('ui.user.device_status') }}</th>
            <th>{{ $t('ui.user.device_authorize_code') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subDevice in subDevices">
            <td>{{ subDevice.product_id }}</td>
            // 这里使用产品id 不是产品名称 debug
            <td>{{ subDevice.mac }}</td>
            <td><span v-if="subDevice.is_online==true">{{ $t('common.online') }}</span><span v-else>{{ $t('common.offline') }}</span></td>
            <td>{{ subDevice.authorize_code }}</td>
          </tr>
          <tr v-if="subDevices.length === 0">
            <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
              <div v-else class="tips-null">{{ $t('ui.user.no_devices_bound') }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import Breadcrumb from 'components/Breadcrumb'
  import InfoCard from 'components/InfoCard'
  import InfoList from 'components/InfoList'
  import Tab from 'components/Tab'

  export default {
    name: 'device-list',

    mixins: [globalMixins],

    components: {
      'api': api,
      Breadcrumb,
      InfoCard,
      InfoList,
      Tab
    }
  }
</script>
