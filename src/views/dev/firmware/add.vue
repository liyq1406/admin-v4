<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>新建任务</h2>
    </div>
    <div class="container row">
      <div class="form-box col-16 mt10">
        <validator name="validation">
          <form novalidate @submit.prevent="onAddTaskSubmit">
            <div class="panel">
              <div class="panel-hd">
                <h3><i class="number">1</i> 选择产品</h3>
              </div>
              <div class="panel-bd">
                <div class="form">
                  <div class="form-row row">
                    <div class="controls col-19 row">
                      <div v-for="product in products" class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="selectProduct" :value="product" @change="getFirmwares" number/>{{product.name}}
                        </label>
                      </div>
                      <!-- <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="timeType" :value="2" number/>吸尘器A1
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="timeType" :value="3" number/>智能灯泡A9
                        </label>
                      </div> -->
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
                        <input v-model="addmodel.name" type="text" name="name" v-validate:name="{required: true, maxlength: 20}" lazy class="input-text"/>
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
                        <input v-model="addmodel.description" name="description" type="text" v-validate:description="{required: true, maxlength: 200}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.description.touched && $validation.description.required">请输入任务描述</span>
                        <span v-if="$validation.description.modified && $validation.description.maxlength">不可超过200个字符</span>
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
                      <div class="inb inbradio" v-for="opt in locales.data.FIRMWARE_TYPES">
                        <label class="radio">
                          <input type="radio" v-model="taskModelType" :value="opt" name="type" number/>{{ opt.label }}
                        </label>
                      </div>
                      <div class="form-row row" v-show="taskModelType.value!==1">
                        <label class="form-control col-5">识别码:</label>
                        <div class="controls col-10">
                          <div class="input-text-wrap">
                            <!-- <input v-model="addmodel.identify" name="identify" type="text" v-validate:identify="{required: true, maxlength: 20}" lazy class="input-text"/> -->
                            <input v-model="addmodel.identify" name="identify" type="text" class="input-text"/>
                          </div>
                          <!-- <div class="form-tips form-tips-error">
                            <span v-if="$validation.identify.touched && $validation.identify.required">请输入识别码</span>
                            <span v-if="$validation.identify.modified && $validation.identify.maxlength">不可超过20个字符</span>
                          </div> -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">起始版本:</label>
                    <div class="controls col-19">
                      <x-select :placeholder="$t('ui.task.select_from_version')" :label="addmodel.from_version.toString()">
                        <select v-model="addmodel.from_version" name="from_version" custom-validator="checkTypeValid" @change="selectFrom" number>
                          <option v-for="firmware in fromFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                        </select>
                      </x-select>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">目标版本:</label>
                    <div class="controls col-19">
                      <x-select  :placeholder="$t('ui.task.select_target_version')" :label="addmodel.target_version.toString()">
                        <select v-model="addmodel.target_version" name="target_version" custom-validator="checkTypeValid" @change="selectTarget" number>
                          <option v-for="firmware in targetFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                        </select>
                      </x-select>
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
                          <input type="radio" v-model="addmodel.task_type" :value="0" number/>自动升级
                        </label>
                      </div>
                      <div class="inb inbradio">
                        <label class="radio">
                          <input type="radio" v-model="addmodel.task_type" :value="1" number/>手动升级
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
  import api from 'api'
  import _ from 'lodash'
  // import { createDayRange } from 'utils'

  // TODO 添加流程确定：选择产品如果版本数小于1？表单通过验证才可以点击按钮？ #weijie
  // TODO 消除冗余代码 #weijie
  // TODO 添加表单验证 #weijie

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
      'x-select': Select,
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
        type: 1,
        selectProduct: {},
        taskModelType: { label: 'WIFI', value: 1 },
        addmodel: {
          name: '',
          description: '',
          type: 1,
          identify: 0,
          product_id: '',
          from_version: '',
          from_version_url: '',
          from_version_md5: '',
          from_version_size: 0,
          target_version: '',
          target_version_url: '',
          target_version_md5: '',
          target_version_size: 0,
          task_type: 0
        },
        firmwares: [],
        adding: false
      }
    },

    computed: {
      fromFirmwares () {
        return this.firmwares.filter((item) => {
          return item.type === this.taskModelType.value && item.version < (this.addmodel.target_version || this.maxVersion)
        })
      },

      targetFirmwares () {
        return this.firmwares.filter((item) => {
          return item.type === this.taskModelType.value && item.version > (this.addmodel.from_version || this.minVersion)
        })
      },

      maxVersion () {
        var max = 0
        this.firmwares.map((item) => {
          max = Math.max(max, item.version)
        })
        return max
      },

      minVersion () {
        var min = Number.MAX_VALUE
        this.firmwares.map((item) => {
          min = Math.min(min, item.version)
        })
        return min
      }
    },

    filters: {
      firmwareUrl (value) {
        var url = ''
        this.firmwares.forEach((element, index) => {
          if (element.version === value) {
            url = element.file_url
          }
        })
        return url
      }
    },

    watch: {
      products () {
        this.selectProduct = this.products[0]
        this.getFirmwares()
      // },
      // selectProduct () {
      //   this.getFirmwares()
      }
    },
    route: {
      data () {
        if (this.selectProduct.id) {
          this.getFirmwares()
        }
        // this.getFirmwares()
      }
    },

    ready () {
      this.selectProduct = this.products[0]
      if (this.selectProduct) {
        this.getFirmwares()
      }
    },
    methods: {
      getTypeLabelByValue (val) {
        return _.find(this.locales.data.FIRMWARE_TYPES, (o) => {
          return o.value === val
        }).label
      },
      // 提交添加任务表单
      onAddTaskSubmit () {
        console.log(this.$validation.valid)
        if (this.$validation.invalid) {
          // this.$validation.name.touched = true
          this.$validate(true)
          return
        }
        this.adding = true
        // if (taskModelType.value!==1) {
        //   this.addmodel.identify = 0
        // }
        this.addmodel.product_id = this.selectProduct.id
        this.addmodel.type = this.taskModelType.value
        api.firmware.task(this.addmodel).then((res) => {
          if (res.status === 200) {
            // this.resetAddTask()
            // this.tasks.push(res.data)
            this.adding = false
            // this.addmodel = {
            //   type: '',
            //   identify: '',
            //   name: '',
            //   description: '',
            //   product_id: '',
            //   from_version: '',
            //   from_version_url: '',
            //   from_version_md5: '',
            //   from_version_size: 0,
            //   target_version: '',
            //   target_version_url: '',
            //   target_version_md5: '',
            //   target_version_size: 0
            // }
          }
          this.showNotice({
            type: 'info',
            content: '成功创建任务！'
          })
          this.$route.router.go('/dev/firmware/list')
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      },
      getFirmwares () {
        this.loadingFirmwares = true
        api.product.getFirmwares(this.selectProduct.id).then((res) => {
          if (res.status === 200) {
            this.firmwares = res.data.list
            this.loadingFirmwares = false
            this.addmodel = {
              type: '',
              identify: '',
              name: '',
              description: '',
              product_id: '',
              from_version: '',
              from_version_url: '',
              from_version_md5: '',
              from_version_size: 0,
              target_version: '',
              target_version_url: '',
              target_version_md5: '',
              target_version_size: 0
            }
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingFirmwares = false
        })
      },
      checkTypeValid (value) {
        return Number(value) >= 0
      },
      // 选择起始版本号
      selectFrom () {
        var firmware = this.firmwares.filter((item) => {
          return item.version === this.addmodel.from_version
        })[0]
        this.addmodel.from_version_url = firmware.file_url
        this.addmodel.from_version_md5 = firmware.file_md5
        this.addmodel.from_version_size = firmware.file_size
      },
      // 选择目标版本号
      selectTarget () {
        var firmware = this.firmwares.filter((item) => {
          return item.version === this.addmodel.target_version
        })[0]
        this.addmodel.target_version_url = firmware.file_url
        this.addmodel.target_version_md5 = firmware.file_md5
        this.addmodel.target_version_size = firmware.file_size
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'
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
    .x-select
      display inline-block

</style>
