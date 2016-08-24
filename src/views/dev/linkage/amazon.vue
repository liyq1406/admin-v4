<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>Amazon echo</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-24">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/amazon.png" alt="nest互联">
            <p>通过amazon echo先进的智能语音服务可以让您的产品与echo进行互联，当用户向echo发送一条设备的语音指令时，echo会识别此命令并传递给xlink服务，并最终与您的设备进行智能语音交互。</p>
            <p>如：向echo说：“Hi alexa，turn on all my lights.”</p>
          </pic-txt>
        </div>
        <div class="mt20" style="padding-left: 126px">
          <span class="mr5">开启amazon echo联动服务</span>
          <!-- <x-switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle="pluginToggle(plugins[0])"></x-switch> -->
          <x-switch size="small" :disabled="loading" :value.sync="plugins[0].enable" @switch-toggle=""></x-switch>
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
    </div>
    <div class="panel" v-show="false">
      <div class="panel-bd">
        <div class="row">
          <div class="col-19">

            <div class="config-box">
              <div class="list row">
                <div class="msg-box">
                  <div class="title">
                    Endpoint
                  </div>
                  <div class="content">
                    The URL for the service endpoint, e.g.https://myskill.ishere.com/somepath, or the Lambda ARN,
                  </div>
                </div>
                <div class="input-box">
                  <div class="radio-group">
                    <label class="radio">
                      <input type="radio"/>HTTPS
                    </label>
                    <label class="radio">
                      <input type="radio"/>Lambda ARN (Amazon Resource Name)
                    </label>
                  </div>
                  <div class="box">
                    <div class="input-text-wrap"><input type="text" class="input-text"></div>
                  </div>
                </div>
              </div>
              <div class="list row">
                <div class="msg-box">
                  <div class="title">
                    Account Linking
                  </div>
                  <div class="content">
                    Do you allow users to create an account or link to an existing account with you?
                  </div>
                </div>
                <div class="input-box">
                  <div class="box">
                    <div class="radio-group">
                      <label class="radio">
                        <input type="radio"/>HTTPS
                      </label>
                      <label class="radio">
                        <input type="radio"/>Lambda ARN (Amazon Resource Name)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <form>
              <div class="form-row row mt20">
                <div class="form-control col-8 alert-label"><div>Endpoint *:</div>
                <i style="font-size: 6px;">The URL for the service endpoint,e.g.https://myskill.ishere.com/somepath,or the Lambda ARN,</i></div>
                <div class="controls form-box col-16">
                  <div v-placeholder="$t('ui.rule.placeholders.name')" class="input-text-wrap">
                    <input type="text" minlength="2" maxlength="32" class="input-text"/>
                  </div>
                </div>
              </div>
            </form> -->
            <!-- <div class="" style="display:table;border-bottom:1px solid #d9d9d9;padding: 10px 0">
              <div class="" style="display: table-cell;word-wrap:break-word;width: 50%;overflow: hidden;"><div style="font-size:10px">Endpoint *:</div>
              <i style="font-size: 8px;line-height:8px">The URL for the service endpoint,e.g.https://myskill.ishere.com/somepath,or the Lambda ARN,</i></div>
              <div class="controls form-box" style="display:table-cell">
                <div class="box">
                  <div class="input-text-wrap" style="text-align:center">
                    <input type="radio" name="1" /><label for="" style="font-size:8px;margin-right:10px">HTTPS</label>
                    <input type="radio" name="1"/><label for="" style="font-size:8px">Lambda ARN</label>
                  </div>
                  <div v-placeholder="''" class="input-text-wrap">
                    <input type="text" minlength="2" maxlength="32" class="input-text"/>
                  </div>
                </div>

              </div>
            </div> -->
            <!-- <div class="row" style="display:block;border-bottom:1px solid #d9d9d9;padding: 10px 0">
              <div class="col-14" style="word-wrap:break-word;"><div style="font-size:10px">Account Linking:</div>
              <i style="font-size: 8px;line-height:8px">Do you allow users to create an account or link to an existing account with you?</i></div>
              <div class="controls form-box col-10" style="display:table-cell">
                <div class="box">
                  <div class="input-text-wrap" style="text-align:center">
                    <input type="radio" name="1" /><label for="" style="font-size:8px;margin-right:10px">HTTPS</label>
                    <input type="radio" name="1"/><label for="" style="font-size:8px">Lambda ARN</label>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import PicTxt from 'components/PicTxt'
  import LinkageItem from './components/LinkageItem'
  import Switch from 'components/Switch'

  export default {
    name: 'Echo',

    components: {
      'pic-txt': PicTxt,
      'linkage-item': LinkageItem,
      'x-switch': Switch
    },

    mixins: [globalMixins],
    data () {
      return {
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
    }
  }
</script>
<style lang="stylus" scoped>

  .config-box
    width 100%
    height auto
    .list
      height 100px
      overflow hidden
      display table
      border-bottom 1px solid #ccc
      .msg-box
      .input-box
        display table-cell
        width 50%
        height 100%
        padding 10px
        box-sizing border-box
        position relative
        min-height 50px
        .box
          width 100%
          position absolute
          top 50%
          left 50%
          transform translate(-50%,-50%)
          padding 10px
          box-sizing border-box




</style>
