<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>IFTTT</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-20">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/ifttttit.png" alt="nest互联">
            <p>IFTTT 是“if this, then that” 的缩写，真正让物联网为你服务！通过设定“如果”实现“就’，从而轻松完成各种硬件之间的智慧互联，突破想象，IFTTT触发你的智能生活！ 如：设定门磁传感器与红外报警器之间的IFTTT，如果门磁监测有人经过，红外报警器开启报警模式；</p>
          </pic-txt>
          <div class="" style="margin-left:110px">
            <span class="mr5">开启萤石联动服务</span>
            <!-- <v-switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle="pluginToggle(plugins[0])"></v-switch> -->
            <v-switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle=""></v-switch>
          </div>
        </div>

      </div>
      <div class="row mt20 mb20" v-show="plugins[0].enable" transition="bottomToTop">
        <div class="col-offset-2 col-10">
          <form>
            <div class="form-row row mb10">
              <label class="form-control col-6" style="line-height:32px">APP ID:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text"  v-model="plugins[0].config.client_id" name="client_id" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6" style="line-height:32px">Access Key:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="plugins[0].config.client_secret" name="client_id" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions col-offset-6 mt20">
              <!-- <button type="submit" @click.prevent.stop="editNestConfig" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button> -->
              <button type="submit" @click.prevent.stop="" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <div class="panel" >
      <div class="linkage-list">
        <linkage-item name="nest thermostat">
          <img slot="thumb" src="../../../assets/images/nest-smoke.png"/>
          <div class="row">
            <div class="col-3">
              <span class="label-text">联动服务：</span>
            </div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableThermostat" :disabled="enableNest"></v-switch>
              <span v-if="!enableThermostat" class="label-text">未开启</span>
              <span v-else class="label-text">已开启</span>
            </div>
          </div>
        </linkage-item>
        <linkage-item name="nest smoke">
          <img slot="thumb" src="../../../assets/images/nest-thermostat.png"/>
          <div class="row">
            <div class="col-3">
              <span class="label-text">联动服务：</span>
            </div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableSmoke" :disabled="enableNest"></v-switch>
              <span v-if="!enableSmoke" class="label-text">未开启</span>
              <span v-else class="label-text">已开启</span>
            </div>
          </div>
        </linkage-item>
      </div>
    </div> -->
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Switch from 'components/Switch'
  import PicTxt from 'components/PicTxt'
  import LinkageItem from './components/LinkageItem'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  // import { pluginFactoryMixin } from '../../opration/plugin/mixins'
  // import _ from 'lodash'
  import api from 'api'

  export default {
    name: 'Nest',

    components: {
      'v-switch': Switch,
      'pic-txt': PicTxt,
      'linkage-item': LinkageItem
    },

    // mixins: [globalMixins, pluginFactoryMixin],
    mixins: [globalMixins],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    data () {
      return {
        editModel: {},
        editValidation: {},
        enableThermostat: false,
        enableSmoke: false,
        enableNest: true,
        loading: false,
        editing: false,
        plugins: [{
          id: '2e07d2ae62ffe000',
          name: 'Google nest互联',
          description: '',
          alias: 'nest',
          enable: false,
          type: 10,
          config: {}
        }]
      }
    },
    route: {
      data () {
        // this.getPlugins()
      }
    },

    methods: {
      // 修改config
      editNestConfig () {
        this.editing = true
        var params = {
          name: this.plugins[0].name,
          enable: this.plugins[0].enable,
          config: {
            client_id: this.plugins[0].config.client_id,
            client_secret: this.plugins[0].config.client_secret
          }
        }
        if (this.plugins[0].id) {
          api.plugin.update(this.plugins[0].id, params).then((res) => {
            if (res.status === 200) {
              this.getPlugins()
            }
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      }
    }
  }
</script>
