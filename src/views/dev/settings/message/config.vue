<template lang="html">
  <div class="main">
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <validator name="validation">
            <form autocomplete="off" v-form name="validation">
              <div class="form-row row borbot">
                <label class="checkbox">
                  <input type="checkbox" v-model="codeEnable" @change="setCaptcha"/>
                  <span>强制使用图形验证码</span>
                </label>
              </div>
              <div class="form-row row">
                <label class="radio">
                  <input type="radio" v-model="selectType" :value=1 @change="getThird" number/>使用云智易默认短信运营商
                </label>
              </div>
              <div class="form-row row">
                <label class="radio">
                  <input type="radio" v-model="selectType" :value=2 @change="getThird" number/>使用厂商自由短信运营商渠道
                </label>
                <div v-if="this.selectType===2" class="form">
                  <div class="form-row row">
                    <label class="form-control col-3 col-offset-1">URL:</label>
                    <div class="controls col-15">
                      <div class="input-text-wrap">
                        <input v-model="customizeModel.url" type="text" placeholder="请输入URL" name="url" custom-validator="noSpacesPrefixAndSuffix" required class="input-text" v-validate:url="{required: true}"/>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.url.touched && $validation.url.required">URL不能为空</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-3 col-offset-1">Token:</label>
                    <div class="controls col-15">
                      <div class="input-text-wrap">
                        <input v-model="customizeModel.token" type="text" placeholder="请输入Token" name="token" custom-validator="noSpacesPrefixAndSuffix" required class="input-text" v-validate:token="{required: true}"/>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.token.touched && $validation.token.required">TOKEN不能为空</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-offset-20">
                      <button :disabled="!verificateShow || customizeModel.success || customizeModel.checking" :class="{'disabled': !verificateShow || customizeModel.success || customizeModel.checking}" class="btn btn-primary w100" @click.prevent.stop="verificateUrl">验证</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <div class="form-control col-7">
                  <label class="radio">
                    <input type="radio" v-model="selectType" :value=3 @change="getThird" number/>使用自定义短信运营商
                  </label>
                </div>
                <div v-if="this.selectType===3 && this.operators.length" class="col-8">
                  <x-select :label="selectedOperator.name">
                    <select v-model="selectedOperator" name="selectedOperator" custom-validator="checkTypeValid" @change="setCustomAcount" number>
                      <option v-for="operator in operators" :value="operator">{{ operator.name }}</option>
                    </select>
                  </x-select>
                </div>
                <div v-if="this.selectType===3 && !this.operators.length" class="col-8 line32">
                  <span class="hl-red">暂无运营商，请添加</span>
                </div>
              </div>
              <div class="form-actions">
                <button @click.prevent="setMessageAcount" :disabled="loadingData || btnAble"  :class="{'disabled':loadingData || btnAble}" class="btn btn-primary btn-xlg widbtn">保存</button>
              </div>
            </form>
        </validator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import JSSHA from 'jssha'
  import {get} from 'src/http'

  export default {
    name: 'MessageSetting',
    vuex: {
      getters: {
        corp: ({ system }) => system.corp
      }
    },
    data () {
      return {
        validation: {},
        selectType: 1,
        codeEnable: false,
        customizeModel: {
          url: '',
          token: '',
          checking: false,
          success: false
        },
        operators: [
          {
            key: '运营商一',
            value: 1
          }, {
            key: '运营商二',
            value: 2
          }
        ],
        loadingData: false,
        selectedOperator: {
          name: '请选择运营商'
        },
        curtomAble: false
      }
    },
    watch: {
      selectType () {
        if (this.selectType === 3) {
          // 获取运营商列表
          this.getList()
        }
      }
    },
    computed: {
      verificateShow () {
        let res = false
        if (this.customizeModel.url && this.customizeModel.token) {
          res = true
          this.customizeModel.success = false
        }
        return res
      },
      btnAble () {
        let res = false
        // 不使用云智易默认短信时
        if (this.selectType === 2 && this.customizeModel.success === true) {
          // 使用厂商自由短信运营商渠道&验证成功
          res = false
        } else if (this.selectType === 1) {
          // 云智易默认
          res = false
        } else if (this.selectType === 2 && this.customizeModel.success === false) {
          // 使用厂商自由短信运营商渠道&验证不成功
          res = true
        } else if (this.selectType === 3 && this.curtomAble === false) {
          // 使用自定义短信运营商&未设置
          res = true
        } else if (this.selectType === 3 && this.curtomAble === true) {
          // 使用自定义短信运营商&已设置
          res = false
        }
        return res
      },
      checkLabel () {
        if (this.customizeModel.success) {
          return '验证成功'
        } else if (this.customizeModel.checking) {
          return '正在验证..'
        } else {
          return '验证'
        }
      }
    },
    ready () {
      this.getMessageAcount()
      this.firstGetThird()
      this.getCaptcha()
    },
    methods: {
      getCaptcha () {
        api.message.getCaptcha().then((res) => {
          if (res.status === 200) {
            console.log(res.data)
            if (res.data.need_captcha_times === 0) {
              // 启用图形验证码
              this.codeEnable = true
            } else {
              this.codeEnable = res.data.need_captcha_times
              this.codeEnable = false
            }
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      setCaptcha () {
        var obj = {
          need_captcha_times: ''
        }
        if (this.codeEnable === false) {
          // 未设置图形验证码
          obj.need_captcha_times = 6
        } else if (this.codeEnable === true) {
          obj.need_captcha_times = 0
        }
        api.message.setCaptcha(obj).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'success',
              content: '图形验证码设置成功！'
            })
          }
        }).catch((res) => {
          this.loadingData = false
          this.codeEnable = !this.codeEnable
          this.handleError(res)
        })
      },
      verificateUrl () {
        if (this.customizeModel.checking) {
          return
        }
        this.customizeModel.checking = true
        let url = this.customizeModel.url
        let timestamp = +new Date()

        let signature = this.corp.id + this.customizeModel.token + timestamp
        let sha1 = new JSSHA('SHA-1', 'TEXT')
        sha1.update(signature)
        signature = sha1.getHash('HEX')
        get(url + '?timestamp=' + timestamp + '&signature=' + signature).then((res) => {
          if (res.status === 200) {
            this.customizeModel.success = true
          }
          this.customizeModel.checking = false
        }).catch((res) => {
          // 验证失败
          this.showNotice({
            type: 'error',
            content: '验证失败'
          })
          this.customizeModel.checking = false
          this.handleError(res)
        })
      },
      getThird () {
        if (this.selectType === 2) {
          api.message.getThirdAcount().then((res) => {
            if (res.status === 200) {
              this.customizeModel.url = res.data.url
              this.customizeModel.token = res.data.token
            }
          }).catch((res) => {
            this.loadingData = false
            this.handleError(res)
          })
        }
      },
      firstGetThird () {
        api.message.getThirdAcount().then((res) => {
          if (res.status === 200) {
            this.customizeModel.url = res.data.url
            this.customizeModel.token = res.data.token
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      /**
       * 获取列表
       */
      getList () {
        this.loadingData = true
        // 获取产品数据端点列表
        var params = {
          filter: ['account_id', 'name'],
          offset: 0,
          limit: 100
        }
        api.message.getList(params).then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.currentPage = 1
            this.operators = res.data.carrier
            // 遍历列表是否有已设置的帐号
            this.operators.forEach((item) => {
              if (item.default === true) {
                this.curtomAble = true
                this.selectedOperator = item
                return
              }
            })
            // this.selectedOperator = this.operators[0]
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      /**
       * 设置发送短信默认帐号
       */
      setMessageAcount () {
        this.loadingData = true
        var params = {
          account_type: this.selectType
        }
        api.message.setMessageAcount(params).then((res) => {
          if (res.status === 200) {
            if (this.selectType === 2) {
              var code = {
                url: this.customizeModel.url,
                token: this.customizeModel.token
              }
              api.message.addThirdAcount(code).then((res) => {
                if (res.status === 200) {
                  this.loadingData = false
                  this.getMessageAcount()
                }
              }).catch((res) => {
                this.loadingData = false
                this.handleError(res)
              })
            } else {
              this.getMessageAcount()
            }
            this.loadingData = false
            // this.getMessageAcount()
            this.showNotice({
              type: 'success',
              content: '设置成功！'
            })
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      /**
       * 获取发送短信默认帐号
       */
      getMessageAcount () {
        this.loadingData = true
        api.message.getMessageAcount().then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.selectType = res.data.account_type
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      /**
       * 设置自定义运营商默认帐号
       */
      setCustomAcount () {
        this.loadingData = true
        var params = {
          account_id: this.selectedOperator.account_id
        }
        api.message.setCustomAcount(params).then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.curtomAble = true
            // this.getMessageAcount()
          }
        }).catch((res) => {
          this.loadingData = false
          this.curtomAble = false
          this.handleError(res)
        })
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus">
  .line32
    line-height 32px
    height 32px
  .borbot
    padding-bottom 20px
    border-bottom 1px solid #d9d9d9
  .smallbtn
    height 32px
    line-height 32px
</style>
