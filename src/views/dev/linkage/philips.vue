<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>Philips hue</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-24">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/huetit.png" alt="nest互联">
            <p>飞利浦Hue拥有多达1600万种颜色的色彩选择，其开放的接口可以允许第三方平台及应用与hue进行连接，开发者可以通过互联功能让您的产品便捷的打通hue应用，并与hue设备实现照明的联动场景。只要想象力够丰富，就能做出更炫的应用，例如通过外围设备状态信息改变灯光颜色变化来表示将要下雨，或设置灯光慢慢变亮表示太阳正在升起等等。</p>
          </pic-txt>
        </div>
        <div class="tal mt20" style="padding-left: 126px">
          <span class="mr5">开启philips hue联动服务</span>
          <switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle=""></x-switch>
        </div>
      </div>
      <div class="row mt20 mb20" v-show="plugins[0].enable" transition="bottomToTop">
        <div class="col-offset-2 col-10">
          <form>
            <div class="form-row row mb10">
              <label class="form-control col-6" style="line-height:32px">client_id:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text"  v-model="plugins[0].config.client_id" name="client_id" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6" style="line-height:32px">client_secret:</label>
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
      <div class="box">
        <div class="container">
          <div class="img fl"></div>
          <div class="content fl">
            <div class="title">
              <span>Hue</span>
            </div>
            <div class="introduce">
              <span>Coming soon......</span>
            </div>
          </div>
        </div>
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
    name: 'Philips',

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
<style lang="stylus" scoped>
  .box
    width 100%
    height 230px
    margin-top 50px
    box-sizing border-box
    position relative
    padding 10px
    .container
      padding 35px 20px
      width 100%
      height 100%
      box-sizing border-box
      border 1px solid #ddd
      .img
        width 158px
        height 158px
        background url('../../../assets/images/hue.png') center center / 100% 100%

      .content
        width 300px
        height 100%
        margin-left 50px
        font-weight bold
        .title
          font-size 28px
          margin-top 35px
        .introduce
          font-size 18px
          color #999
          margin-top 10px
</style>
