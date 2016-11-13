<template>
  <div class="row">
    <div class="form-box col-16">
      <validator name="validation">
        <form autocomplete="off" novalidate @submit.prevent="onAddSubmit">
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
                        <input type="radio" v-model="selectProduct" :value="product" @change="" number/>{{product.name}}
                      </label>
                    </div>
                    <!-- <div class="inb inbradio">
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
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">2</i> 固件信息</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">固件类型:</label>
                  <div class="controls col-19 row">
                    <div class="inb inbradio" v-for="opt in locales.data.FIRMWARE_TYPES">
                      <label class="radio">
                        <input type="radio" v-model="addModelType"  :value="opt" name="type" number/>{{opt.label}}
                      </label>
                    </div>
                    <!-- <div class="inb inbradio">
                      <label class="radio">
                        <input type="radio" v-model="type" :value="2" number/>MCU
                      </label>
                    </div> -->
                    <!-- <div class="inb inbradio">
                      <label class="radio">
                        <input type="radio" v-model="type" :value="3" number/>子设备
                      </label>
                    </div> -->
                    <div class="form-row row" v-if="addModelType.value!== 1">
                      <label class="form-control col-5">识别码:</label>
                      <div class="controls col-10">
                        <div class="input-text-wrap">
                          <input v-model="addmodel.identify" v-validate:identify="{required: addModelType.value!== 1, maxlength: 20}"  name="addmodel.identify" type="text" class="input-text"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.identify.touched && $validation.identify.required">请输入识别码</span>
                          <span v-if="$validation.identify.modified && $validation.identify.maxlength">不可超过20个字符</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5">固件型号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入固件型号'" class="input-text-wrap">
                      <input v-model="addmodel.mod" type="text" name="addmodel.mod" v-validate:mod="{required: true, maxlength: 20}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.mod.touched && $validation.mod.required">请输入固件型号</span>
                      <span v-if="$validation.mod.modified && $validation.mod.maxlength">不可超过20个字符</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5">固件版本号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入固件版本号'" class="input-text-wrap">
                      <input v-model="addmodel.version" type="text" name="addmodel.version" v-validate:version="{required: true, maxlength: 20, format: 'integer'}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.version.touched && $validation.version.required">请输入固件版本号</span>
                      <span v-if="$validation.version.modified && $validation.version.maxlength">不可超过20个字符</span>
                      <span v-if="$validation.version.modified && $validation.version.format">固件版本号必须是整数</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">3</i> 上传文件</h3>
            </div>
            <div class="panel-bd">
              <div class="controls">
                <file-uploader :input="firmwareInput" :input-value="inputValue" type="firmware" :api-url="uploadApi" @upload-success="onUploadSuccess" @reset="onResetUpload">
                  <label :class="{'disabled':unableAdd}" class="btn btn-ghost btn-upload mb10 mt10">
                    <input type="file" name="firmwareInput" @change.prevent="uploadFirmware($event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('ui.firmware.uploading') : $t('ui.firmware.upload') }}
                  </label>
                  <div v-if="addmodel.file_url.length > 0" class="file-url">url: {{ addmodel.file_url }}</div>
                </file-uploader>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">4</i> 版本说明</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5 radio">版本说明:</label>
                  <div class="controls col-19">
                    <div class="input-text-wrap" v-placeholder="'请输入内容'">
                      <textarea class="input-text textarea" v-model="addmodel.description" name="command"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary widbtn">保存</button>
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
import { API_SERVER } from 'consts/config'
import api from 'api'

export default {
  name: 'UploadFirmware',

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all,
      plugins: ({ plugins }) => plugins.all
    }
  },

  data () {
    return {
      inputValue: '',
      adding: false,
      emptyArr: [],
      addModelType: { label: 'WIFI', value: 1 },
      selectProduct: {},
      title: '',
      content: '',
      timeType: 1,
      type: 1,
      style: '',
      version: '',
      firmwareInput: null,
      addmodel: {
        mod: '',
        version: '',
        file_url: '',
        file_md5: '',
        file_size: '',
        description: '',
        release_date: '',
        is_release: '',
        type: '',
        identify: ''
      },
      uploadApi: '' // 固件上传 API 地址
    }
  },

  computed: {
    unableAdd () {
      var unable = true
      if (this.selectProduct && this.selectProduct.id) {
        unable = false
      } else {
        unable = true
      }
      return unable
    }
  },

  watch: {
    products () {
      this.init()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    init () {
      if (this.products.length) {
        this.selectProduct = this.products[0]
        this.uploadApi = `${API_SERVER.default}/v2/upload/product/${this.selectProduct.id}/firmware`
      }
    },

    // 添加固件版本操作
    onAddSubmit () {
      if (this.adding) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }
      if (!this.addmodel.file_url.length) {
        this.showNotice({
          type: 'error',
          content: '请上传固件文件'
        })
        return
      }
      this.adding = true
      this.addmodel.type = this.addModelType.value
      this.addmodel.is_release = true
      this.addmodel.release_date = new Date()
      api.product.addFirmware(this.selectProduct.id, this.addmodel).then((res) => {
        if (res.status === 200) {
          // this.resetAdd()
          // this.getFirmwares()
          this.showNotice({
            type: 'info',
            content: '成功创建版本！'
          })
          this.adding = false
          this.$route.router.go('/dev/firmware/manage')
        }
      }).catch((res) => {
        this.handleError(res)
        this.adding = false
      })
      // if (!this.$validation.valid) {
      //   this.$validation.mod.touched = true
      //   this.$validation.version.touched = true
      //   return
      // }
      // if (!this.selectProduct.id) {
      //   this.showErrors('请选择产品！')
      //   return
      // }
      // if (!this.addmodel.file_url) {
      //   this.showErrors('请上传固件！')
      //   return
      // }
      // if (!this.addmodel.description) {
      //   this.showErrors('请添加版本说明，250字以内！')
      //   return
      // }
    },
    showErrors (str) {
      this.showNotice({
        type: 'error',
        content: str
      })
    },

    /**
     * 上传固件文件
     * @author shengzhi
     * @param {HTMLDOMEvent} e 事件
     */
    uploadFirmware (e) {
      this.inputValue = e.target.value
      this.firmwareInput = e.target
    },

    /**
     * 固件上传成功处理
     * @author shengzhi
     * @param {Object} data 上传成功后服务器返回的数据
     */
    onUploadSuccess (data) {
      this.addmodel.file_url = data.url
      this.addmodel.file_md5 = data.md5
      this.addmodel.file_size = data.size
    },

    /**
     * 上传重置处理
     * @author shengzhi
     */
    onResetUpload (input) {
      input.value = ''
      this.inputValue = ''
    }
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
  .x-select
    display inline-block
</style>
