<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>IFTTT</h2>
    </div>
    <div class="panel bornon">
      <div class="row mt20 mb20">
        <div class="col-24">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/ifttttit.png" alt="nest互联">
            <p>IFTTT 是“if this, then that” 的缩写，真正让物联网为你服务！通过设定“如果”实现“就’，从而轻松完成各种硬件之间的智慧互联，突破想象，IFTTT触发你的智能生活！ 如：设定门磁传感器与红外报警器之间的IFTTT，如果门磁监测有人经过，红外报警器开启报警模式；</p>
          </pic-txt>
          <!-- <div class="" style="margin-left:110px">
            <span class="mr5">开启萤石联动服务</span>
            <switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle=""></x-switch>
          </div> -->
        </div>

      </div>
      <!-- <div class="row mt20 mb20" v-show="plugins[0].enable" transition="bottomToTop">
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
              <button type="submit" @click.prevent.stop="" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div> -->
    </div>
    <div class="panel">
      <div class="linkage-list">
        <div class="hl-gray" style="line-height:120px;margin-left:110px">Coming soon...</div>
      </div>
    </div>
  </div>
</template>

<script>
  import LinkageItem from './components/LinkageItem'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  // import { pluginFactoryMixin } from '../../opration/plugin/mixins'
  import api from 'api'

  export default {
    name: 'Ifttt',

    components: {
      LinkageItem
    },

    // mixins: [pluginFactoryMixin],
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
<style lang="stylus">
  .bornon
    border none
</style>
