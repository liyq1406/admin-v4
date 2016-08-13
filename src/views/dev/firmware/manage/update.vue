<template>
  <div class="main">
    <div class="container row">
      <div class="form-box col-16">
        <validator name="validation">
          <form novalidate @submit.prevent="">
            <div class="panel">
              <div class="panel-hd">
                <h3><i class="number">1</i> 选择产品</h3>
              </div>
              <div class="panel-bd">
                <div class="form">
                  <div class="form-row row">
                    <div class="controls col-19 row">
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="timeType" :value="1" number/>电饭煲A8
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="timeType" :value="2" number/>吸尘器A1
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="timeType" :value="3" number/>智能灯泡A9
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd">
                <h3><i class="number">2</i> 任务信息</h3>
              </div>
              <div class="panel-bd">
                <div class="form">
                  <div class="form-row row">
                    <label class="form-control col-5">任务名称:</label>
                    <div class="controls col-19">
                      <div v-placeholder="'请填写任务名称'" class="input-text-wrap">
                        <input v-model="name" type="text" name="name" v-validate:name="{required: true, maxlength: 20}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.name.touched && $validation.name.required">请输入任务名称</span>
                        <span v-if="$validation.name.modified && $validation.name.maxlength">不可超过20个字符</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">任务描述:</label>
                    <div class="controls col-19">
                      <div v-placeholder="'不可超过200个字符'" class="input-text-wrap">
                        <input v-model="content" name="content" type="text" v-validate:content="{required: true, maxlength: 200}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.content.touched && $validation.content.required">请输入任务描述</span>
                        <span v-if="$validation.content.modified && $validation.content.maxlength">不可超过200个字符</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd">
                <h3><i class="number">3</i> 升级详情</h3>
              </div>
              <div class="panel-bd">
                <div class="form">
                  <div class="form-row row">
                    <label class="form-control col-5">固件类型:</label>
                    <div class="controls col-19 row">
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="type" :value="1" number/>WIFI
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="type" :value="2" number/>MCU
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="type" :value="3" number/>子设备
                        </label>
                      </div>
                      <div class="form-row row" v-show="type === 3">
                        <label class="form-control col-5">识别码:</label>
                        <div class="controls col-10">
                          <div v-placeholder="'请输入识别码'" class="input-text-wrap">
                            <input v-model="code" name="code" type="text" v-validate:code="{required: true, maxlength: 20}" lazy class="input-text"/>
                          </div>
                          <div class="form-tips form-tips-error">
                            <span v-if="$validation.code.touched && $validation.code.required">请输入识别码</span>
                            <span v-if="$validation.code.modified && $validation.code.maxlength">不可超过20个字符</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">起始版本:</label>
                    <div class="controls col-19">
                      <v-select :label="">
                        <select v-model="" @change="">
                          <option v-for="item in emptyArr" :value="item"></option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">目标版本:</label>
                    <div class="controls col-19">
                      <v-select :label="">
                        <select v-model="" @change="">
                          <option v-for="item in emptyArr" :value="item"></option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel-hd">
                <h3><i class="number">4</i> 升级模式</h3>
              </div>
              <div class="panel-bd">
                <div class="form">
                  <div class="form-row row">
                    <label class="form-control col-5">升级模式:</label>
                    <div class="controls col-19 row">
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="type" :value="1" number/>自动升级
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="type" :value="2" number/>手动升级
                        </label>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary widbtn">立即升级</button>
              <button @click.prevent.stop="" class="btn btn-default widbtn">取消</button>
              <!-- <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary">{{ $t("common.cancel") }}</button> -->
            </div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'
  import DatePicker from 'components/DateTimeSinglePicker'
  import AreaSelect from 'components/AreaSelect'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import TagInput from 'components/TagInput'
  import store from 'store'
  // import api from 'api'
  // import { createDayRange } from 'helpers/utils'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        products: ({ products }) => products.all,
        plugins: ({ plugins }) => plugins.all
      }
    },

    components: {
      'v-select': Select,
      'date-picker': DatePicker,
      'area-select': AreaSelect,
      'tag-input': TagInput,
      RadioButtonGroup
    },

    data () {
      return {
        emptyArr: [],
        needVerificationUsers: false,
        needVerification: false,
        title: '',
        content: '',
        timeType: 1,
        type: 1
      }
    },

    computed: {
    },

    route: {
      data () {
      }
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .widbtn
    width 100px
    margin-right 10px
  .inb
    display inline-block
  .inbradio
    margin-right 10px
  .number
    display inline-block
    width 20px
    height 20px
    line-height 20px
    border-radius 50%
    text-align center
    background #2389c5
    color #fff
    font-size 12px
    position relative
    bottom 2px
  .form
    max-width 640px
    padding-left 30px
    box-sizing border-box
    .directional .form-row.userTag
      height auto
    .tips
      height 50px
      line-height 50px
      border-bottom 1px dashed #ccc
      color #666
      .fa
        font-size 18px
        margin 0 5px
    .textarea
      height 150px
    .directional
    .single
      .form-row
        padding-top 5px
        padding-bottom 10px
        height auto
        /*line-height 40px*/
        border-bottom 1px dashed #ccc

    .check-group-box
      padding-bottom 5px
      .label
        line-height 26px
  .panel
    border-bottom 0
    .panel-hd
      h3
        margin-bottom 0
        margin-top 0
        padding-bottom 10px
        border-bottom 1px solid #d9d9d9
  .select-group
    .v-select
      display inline-block

</style>
