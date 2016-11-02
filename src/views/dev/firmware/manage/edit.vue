<template>
  <div class="main">
    <div class="main-title">
      <h2>版本编辑</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="validation">
      <form autocomplete="off" novalidate @submit.prevent="onEditSubmit">
        <div class="panel">
          <div class="panel-bd">
            <div class="row">
              <div class="form col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">产品:</label>
                  <div class="controls col-19 row line32">
                    <label>{{currProduct.name}}</label>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">固件类型:</label>
                  <div class="controls col-19 row line32">
                    <label v-if="firmware.type===1">WIFI</label>
                    <label v-if="firmware.type===2">MCU</label>
                    <label v-if="firmware.type===3">子设备</label>
                  </div>
                </div>
                <div v-if="firmware.type && firmware.type!==1" class="form-row row">
                  <label class="form-control col-5 dealer-label">识别码:</label>
                  <div class="controls col-19 row line32">
                    <!-- <div v-placeholder="'请输入识别码'" class="input-text-wrap">
                      <input type="text" v-model="firmware.identify" name="firmware.identify" minlength="2" maxlength="32" v-validate:identify="{required: true}" lazy class="input-text"/>
                    </div> -->
                    <span>{{firmware.identify}}</span>
                    <!-- <div class="form-tips form-tips-error">
                      <span v-if="$validation.identify.touched && $validation.identify.required">识别码是必填</span>
                    </div> -->
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">固件型号:</label>
                  <div class="controls col-19 row line32">
                    <div v-placeholder="'请输入固件型号'" class="input-text-wrap">
                      <input type="text" v-model="firmware.mod" name="firmware.mod" minlength="2" maxlength="32" v-validate:mod="{required: true, maxlength: 20}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.mod.touched && $validation.mod.required">请输入固件型号</span>
                      <span v-if="$validation.mod.modified && $validation.mod.maxlength">不可超过20个字符</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">固件版本号:</label>
                  <div class="controls col-19 row line32">
                    <div v-placeholder="'请输入固件版本号'" class="input-text-wrap">
                      <input type="text" v-model="firmware.version" name="firmware.version" minlength="2" maxlength="32" v-validate:version="{required: true, maxlength: 20}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.version.touched && $validation.version.required">请输入固件版本号</span>
                      <span v-if="$validation.version.modified && $validation.version.maxlength">不可超过20个字符</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">固件文件:</label>
                  <div class="controls col-19 row line32">
                    <file-upload :input="firmwareInput" :input-value="inputValue" type="firmware" :api-url="uploadApi" @upload-success="onUploadSuccess" @reset="onResetUpload">
                      <div v-if="firmware.file_url.length > 0" class="file-url">url: {{ firmware.file_url }}</div>
                      <label class="btn btn-ghost btn-upload mb10 mt10">
                        <input type="file" name="firmwareInput" @change.prevent="uploadFirmware($event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('ui.firmware.uploading') : $t('ui.firmware.upload') }}
                      </label>
                    </file-upload>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 radio">版本说明:</label>
                  <div class="controls col-19">
                    <div class="input-text-wrap" v-placeholder="'请输入内容'">
                      <textarea class="input-text textarea" v-model="firmware.description" name="command"></textarea>
                    </div>
                  </div>
                </div>
                <div class="form-actions">
                  <button @submit.prevent.stop="onEditSubmit" type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary widbtn">保存</button>
                  <button @click.prevent.stop="delSubmit" class="btn btn-default widbtn">删除固件</button>
                  <!-- <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary">{{ $t("common.cancel") }}</button> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import api from 'api'
import Breadcrumb from 'components/Breadcrumb'
import FileUpload from 'components/FileUpload'
import { API_SERVER } from 'consts/config'

export default {
  name: 'EditFirmware',

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    FileUpload,
    Breadcrumb
  },

  data () {
    return {
      inputValue: '',
      firmwareInput: null,
      firmware: {
        name: '',
        type: 1,
        identify: 123,
        mod: '',
        version: '',
        file_url: '',
        file_md5: '',
        file_size: ''
      },
      currProduct: {},
      adding: false,
      emptyArr: [],
      addModelType: { label: 'WIFI', value: 1 },
      selectProduct: {},
      needVerificationUsers: false,
      needVerification: false,
      title: '',
      content: '',
      timeType: 1,
      type: 1,
      style: '',
      version: '',
      breadcrumbNav: [{
        label: '全部',
        link: '/dev/firmware/manage'
      }, {
        label: '编辑固件版本'
      }],
      uploadApi: '' // 固件上传 API 地址
    }
  },

  watch: {
    products () {
      this.getProductName()
    }
  },

  created () {
    this.getProductName()
  },

  ready () {
    this.uploadApi = `${API_SERVER.default}/v2/upload/product/${this.$route.params.product_id}/firmware`
    this.getFirmware()
    this.getProductName()
  },

  methods: {
    // 获取当前产品名称
    getProductName () {
      this.products.forEach((product) => {
        if (product.id === this.$route.params.product_id) {
          this.currProduct = product
        }
      })
    },
    /**
     * 获取固件信息
     */
    getFirmware () {
      api.product.getFirmware(this.$route.params.product_id, this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.firmware = res.data
          // this.total = res.data.count
          // this.loadingFirmwares = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingFirmwares = false
      })
    },
    // 编辑固件版本操作
    onEditSubmit () {
      this.adding = true
      api.product.updateFirmware(this.$route.params.product_id, this.firmware).then((res) => {
        if (res.status === 200) {
          // this.resetAdd()
          // this.getFirmwares()
          this.showNotice({
            type: 'info',
            content: '修改成功！'
          })
          this.$route.router.go('/dev/firmware/manage')
        }
      }).catch((res) => {
        this.handleError(res)
        this.adding = false
      })
    },
    // 删除固件版本
    delSubmit () {
      var result = window.confirm('确认删除该版本吗?')
      if (result === true) {
        api.product.deleteFirmware(this.$route.params.product_id, this.firmware.id).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'info',
              content: '删除成功！'
            })
            this.$route.router.go('/dev/firmware/manage')
          }
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      }
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
      this.firmware.file_url = data.url
      this.firmware.file_md5 = data.md5
      this.firmware.file_size = data.size
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
  .line32
    line-height 32px
  .mbt10
    margin-top 10px
    margin-bottom 10px
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
</style>
