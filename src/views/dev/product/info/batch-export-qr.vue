<template>
  <div class="">
    <modal :show.sync="show" width="700px">
      <h3 slot="header">批量导出二维码</h3>
      <div slot="body" class="">
        <div class="body-wrap">
          <div class="filter-device">
            <!-- <div class="arrow"></div> -->
            <div class="row item">
              <div class="col-6 label">选择二维码字段:</div>
              <div class="col-18">
                <div class="field-wrap">
                  <button class="btn btn-ghost" :class="{'btn-select': snSelect}" @click="snSelect=!snSelect">SN
                    <i v-if="snSelect" class="fa fa-check"></i>
                  </button>
                  <button class="btn btn-ghost select-check" :class="{'btn-select': pidSelect}" @click="pidSelect=!pidSelect">PID
                    <i v-if="pidSelect" class="fa fa-check"></i>
                  </button>
                  <button class="btn btn-ghost select-check" :class="{'btn-select': macSelect}" @click="macSelect=!macSelect">MAC
                    <i v-if="macSelect" class="fa fa-check"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="row item">
              <div class="col-6 label">自定义附加信息:
                <i class="fa fa-question-circle tips-icon" v-tooltip="tipLabel"></i>
              </div>
              <div class="col-18">
                <div v-for="rule in customRules" class="row input-text-wrap">
                  <div class="col-4 key-input">
                    <input v-model="rule.key" type="text" class="input-text"/>
                  </div>
                  <div class="col-14 value-input">
                    <input v-model="rule.value" type="text" class="input-text"/>
                  </div>
                  <div v-if="$index === customRules.length-1" class="col-2">
                    <button class="btn btn-ghost add-btn" @click="addRule($index)">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                  <div v-else class="col-1 del-icon">
                    <i class="fa fa-times-circle" @click="delRule($index)"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="row item">
              <div class="col-6 label">二维码信息预览:</div>
              <div class="col-18">
                <span class="qrcode-preview">{{preview}}</span>
              </div>
              </div>
          </div>
          <div class="fr mr10 mt20">
            <button class="btn btn-primary btn-lg"  @click="exportQrcode">批量导出</button>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import Modal from 'components/Modal'
  import { API_SERVER } from 'consts/config'

  export default {
    name: 'batch-export-qr',
    components: {
      Modal
    },
    props: {
      show: {
        type: Boolean,
        default: false,
        twoway: true
      }
    },
    data () {
      return {
        tipLabel: '您可以自定义二维码附件信息，如url地址、版本信息、下载地址等，<br/>格式以key：value区分，附件信息添加越多，二维码信息越复杂；<br/>例：url ： www.baidu.com',
        snSelect: true,
        pidSelect: true,
        macSelect: false,
        customRules: [
          {
            key: '',
            value: ''
          }
        ]
      }
    },
    computed: {
      queryCondition () {
        let temp = {
          record_id: this.$route.params.import_id,
          custom_field: this.customField,
          custom_property: this.customProperty,
          access_token: window.localStorage.getItem('accessToken')
        }
        return window.btoa(JSON.stringify(temp))
      },
      customProperty () {
        let temp = {}
        for (let i = 0; i < this.customRules.length - 1; i++) {
          temp[this.customRules[i].key] = this.customRules[i].value
        }
        return temp
      },
      customField () {
        let temp = []
        if (this.snSelect) {
          temp.push('sn')
        }
        if (this.macSelect) {
          temp.push('mac')
        }
        if (this.pidSelect) {
          temp.push('pid')
        }
        return temp
      },
      preview () {
        let temp = 'XQR:T:D;QK:%QRKEY%'
        if (this.snSelect) {
          temp = temp + 'SN:%SN%;'
        }
        if (this.macSelect) {
          temp = temp + 'MAC:%MAC%;'
        }
        if (this.pidSelect) {
          temp = temp + 'PID:%PID%;'
        }
        for (let i = 0; i < this.customRules.length - 1; i++) {
          temp = temp + this.customRules[i].key + ':' + this.customRules[i].value + ';'
        }
        return temp
      }
    },
    ready () {},
    methods: {
      addRule (index) {
        if (index >= 19) {
          return
        }
        if (this.customRules[index].key === '' || this.customRules[index].value === '') {
          return
        }
        this.customRules.push({
          key: '',
          value: ''
        })
      },
      delRule (index) {
        this.customRules.splice(index, 1)
      },
      exportQrcode () {
        let url = `${API_SERVER.default}/v2/product/${this.$route.params.id}/export/qrcode_by_import_record?query=${this.queryCondition}`
        let tempIframe = document.createElement('iframe')
        tempIframe.src = url
        document.body.appendChild(tempIframe)
        setTimeout(() => {
          document.body.removeChild(tempIframe)
        }, 1000)
      }
    }
  }
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'
  .modal-header
    border-bottom none !important
    h3
      margin-top 10px !important
      text-indent 20px
      font-size 18px
      color #666666 !important
  .body-wrap
    position relative
    .filter-device
      background-color #F2F2F2
      margin 0 -30px
      padding 20px 30px
      font-size 15px
      .btn-select
        border 1px solid #FF0000
        color #FF0000
      .arrow
        width 20px
        height 20px
        background-color #F2F2F2
        position absolute
        top -10px
        left 128px
        transform rotate(45deg)
      .item
        margin-top 30px
        margin-bottom 20px
        .label
          text-align right
          padding-right 20px
          box-sizing border-box
          color #1E1E1E
          line-height 26px
        .sn-range-label
          line-height 28px
    .tips-wrap
       width 100%
       &:after
         content ''
         clear both
         display block
      .tips
        color red
        margin-bottom 5px
        width 120px
        text-align center
    .field-wrap
      button
        width 100px
        position relative
        i
          position absolute
          right 3px
          bottom 1px
    .tips-icon
      vertical-align super
      font-size 13px
    .add-btn
      height 32px
      width 32px
      padding 0
    .key-input
      margin-right 10px
    .value-input
      margin-right 10px
    .input-text-wrap
      margin-bottom 10px
    .del-icon
      height 32px
      width 32px
      i
        line-height 32px !important
  .qrcode-preview
    display inline-block
    word-break break-all
    font-size 13px
</style>
