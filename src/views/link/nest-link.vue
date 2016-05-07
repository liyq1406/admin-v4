<template>
  <section>
    <div class="panel introducebg">
      <div class="introduce clearfix">
        <div class="pic">
          <img src="../../assets/images/nest.png" alt="nest互联">
        </div>
        <div class="tips">
          <p>提示：nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。</p>
          <p>如当电灯开关打开时，自动设定nest的工作状态。</p>
        </div>
        <div class="isopenul">
          <i>是否开启nest服务</i>
          <v-switch size="small" :value.sync="ul_show"></v-switch>
        </div>
      </div>
    </div>
    <div class="panel" v-if="ul_show">
      <ul class="nestul">
        <li>
          <div class="nestli">
            <img src="../../assets/images/device_thumb.png">
            <div class="nestarea">
              <p class="nestname">nest thermostat</p>
              <div class="nestaction">
                <b>联动服务：</b>
                <span class="status">
                  <v-switch size="small" :value.sync="ther_show"></v-switch>
                </span>
                <i v-if="!ther_show">未开启</i>
                <i v-else>已开启</i>
              </div>
              <!-- <div v-if="ther_show" class="editProduct">
                <form v-form name="editValidation">
                  <div class="form-row row">
                    <label class="form-control col-6">product_id:</label>
                    <div class="controls col-14">
                      <div class="input-text-wrap">
                        <input v-model="editModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-6">product_key:</label>
                    <div class="controls col-14">
                      <div class="input-text-wrap">
                        <input v-model="editModel.mod" type="password" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary">保存</button>
                  </div>
                </form>
              </div> -->
            </div>
          </div>
        </li>
        <li>
          <div class="nestli">
            <img src="../../assets/images/device_thumb.png">
            <div class="nestarea">
              <p class="nestname">nest smoke</p>
              <div class="nestaction">
                <b>联动服务：</b>
                <span class="status">
                  <v-switch size="small" :value.sync="smoke_show"></v-switch>
                </span>
                <i v-if="!smoke_show">未开启</i>
                <i v-else>已开启</i>
              </div>
              <!-- <div v-if="smoke_show" class="editProduct">
                <form v-form name="editValidation">
                  <div class="form-row row">
                    <label class="form-control col-6">product_id:</label>
                    <div class="controls col-14">
                      <div class="input-text-wrap">
                        <input v-model="editModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-6">product_key:</label>
                    <div class="controls col-14">
                      <div class="input-text-wrap">
                        <input v-model="editModel.mod" type="password" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary">保存</button>
                  </div>
                </form>
              </div> -->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Switch from '../../components/Switch'

  export default {
    name: 'Devices_link',

    layout: 'admin',

    components: {
      'v-switch': Switch
    },

    mixins: [globalMixins],

    data () {
      return {
        editModel: {},
        editValidation: {},
        ther_show: false,
        smoke_show: false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/stylus/common'
  .introducebg
    background-color #E4E4E4
    border none!important
    height 90px
  .introduce
    position relative
    .pic
      position absolute
      top 20px
      left 0
      display inline-block

    .tips
      font-size 12px
      display inline-block
      margin-left 106px
      margin-top 20px
      p
        margin 0
  .nestul
    li
      min-height 180px
      border-bottom 1px solid #E4E4E4
    li:last-child
      border-bottom none
  .nestli
    position relative
    padding 0 0 20px 0
    img
      position absolute
      top 20px
      left 10px
      width 120px
      height 120px
    .nestarea
      margin-left 150px
      padding-top 40px
      .nestaction
        i
          font-size 12px
          color #666666
          margin-left 10px
        b
          font-size 12px
          color #999999
  .editProduct
    margin-top 30px
    border 1px solid #E4E4E4
    background-color #F2F2F2
    box-sizing border-box
    padding 20px
    width 80%
  .form-row
    margin-bottom 20px
    label
      height 32px
      line-height 32px
  .form-actions
    button
      margin-left 25%
  .isopenul
    position absolute
    top 20px
    right 10px
    i
      margin-right 10px
</style>
