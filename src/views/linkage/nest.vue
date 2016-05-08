<template>
  <section>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-16">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../assets/images/nest.png" alt="nest互联">
            <p>提示：nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。</p>
            <p>如当电灯开关打开时，自动设定nest的工作状态。</p>
          </pic-txt>
        </div>
        <div class="col-8 tar">
          <span class="mr5">是否开启nest服务</span>
          <v-switch size="small" :value.sync="enableNest"></v-switch>
        </div>
      </div>
    </div>
    <div class="panel" v-if="enableNest">
      <div class="linkage-list">
        <linkage-item name="nest thermostat">
          <img slot="thumb" src="../../assets/images/device_thumb.png"/>
          <div class="row">
            <div class="col-2">联动服务：</div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableThermostat"></v-switch>
              <span v-if="!enableThermostat">未开启</span>
              <span v-else>已开启</span>
            </div>
          </div>
        </linkage-item>
        <linkage-item name="nest smoke">
          <img slot="thumb" src="../../assets/images/device_thumb.png"/>
          <div class="row">
            <div class="col-2">联动服务：</div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableSmoke"></v-switch>
              <span v-if="!enableSmoke">未开启</span>
              <span v-else>已开启</span>
            </div>
          </div>
        </linkage-item>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Switch from '../../components/Switch'
  import PicTxt from '../../components/PicTxt'
  import LinkageItem from './components/LinkageItem'

  export default {
    name: 'Nest',

    layout: 'admin',

    components: {
      'v-switch': Switch,
      'pic-txt': PicTxt,
      'linkage-item': LinkageItem
    },

    mixins: [globalMixins],

    data () {
      return {
        editModel: {},
        editValidation: {},
        enableThermostat: false,
        enableSmoke: false,
        enableNest: true
      }
    }
  }
</script>
