<template>
  <div>
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-3">账户类型:</label>
            <div class="controls col-21">
              <div class="clearfix">
                <div v-for="type in typeOptions" class="form-control rule-type-item mr10">
                  <input v-model="selectedType" type="radio" name="rule-selectedType" :value="type">
                  <span>{{type.label}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">帐号名称:</label>
            <div class="controls col-15">
              <div class="input-text-wrap">
                <input v-model="name" type="text" placeholder="请输入帐号名称" v-validate:name="{required: true, minlength: 2, maxlength: 30}" name="name" class="input-text"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入帐号名称</span>
                  <span v-if="$validation.name.modified && $validation.name.minlength">帐号名称不能少于2位</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">帐号名称不能大于等于30位</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">国家区号:</label>
            <div class="controls col-15">
              <x-select :label="selectedCode.label" width="200px">
                <select v-model="selectedCode">
                  <option v-for="code in countryCode" :value="code">{{ code.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">描述:</label>
            <div class="controls col-15">
              <div class="input-text-wrap">
                <input v-model="desc" type="text" placeholder="请输入描述" v-validate:desc="{required: true, minlength: 2, maxlength: 30}" name="desc" class="input-text"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.desc.touched && $validation.desc.required">请输入描述</span>
                  <span v-if="$validation.desc.modified && $validation.desc.minlength">描述不能少于2位</span>
                  <span v-if="$validation.desc.modified && $validation.desc.maxlength">描述不能大于等于30位</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedType.value===1">
            <div class="form-row row">
              <label class="form-control col-3">URL:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.server_url" type="text" placeholder="请输入URL" v-validate:url="{required: true}" name="dayu.server_url" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.url.touched && $validation.url.required">请输入url</span>
                    <!-- <span v-if="$validation.url.modified && $validation.url.minlength">url不能少于2位</span>
                    <span v-if="$validation.url.modified && $validation.url.maxlength">url不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">app_key:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.app_key" type="text" placeholder="请输入URL" v-validate:appkey="{required: true}" name="dayu.app_key" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.appkey.touched && $validation.appkey.required">请输入app_key</span>
                    <!-- <span v-if="$validation.appkey.modified && $validation.appkey.minlength">app_key不能少于2位</span>
                    <span v-if="$validation.appkey.modified && $validation.appkey.maxlength">app_key不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">app_secret:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.app_secret" type="text" placeholder="请输入app secret" v-validate:appsecret="{required: true}" name="dayu.app_secret" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.appsecret.touched && $validation.appsecret.required">请输入app_secret</span>
                    <!-- <span v-if="$validation.appsecret.modified && $validation.appsecret.minlength">app_secret不能少于2位</span>
                    <span v-if="$validation.appsecret.modified && $validation.appsecret.maxlength">app_secret不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">注册帐号模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.register_template.free_sign_name" type="text" placeholder="请输入短信签名" v-validate:freesignname="{required: true}" name="dayu.register_template.free_sign_name" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.freesignname.touched && $validation.freesignname.required">请输入短信签名</span>
                    <!-- <span v-if="$validation.freesignname.modified && $validation.freesignname.minlength">短信签名不能少于2位</span>
                    <span v-if="$validation.freesignname.modified && $validation.freesignname.maxlength">短信签名不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="controls col-15 col-offset-3">
                <div class="input-text-wrap">
                  <input v-model="dayu.register_template.template_code" type="text" placeholder="请输入模板ID" v-validate:templatecode="{required: true}" name="dayu.register_template.template_code" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.templatecode.touched && $validation.templatecode.required">请输入模板ID</span>
                    <!-- <span v-if="$validation.templatecode.modified && $validation.templatecode.minlength">模板ID不能少于2位</span>
                    <span v-if="$validation.templatecode.modified && $validation.templatecode.maxlength">模板ID不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">忘记密码模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.forgot_template.free_sign_name" type="text" placeholder="请输入短信签名" v-validate:freesignname2="{required: true}" name="dayu.forgot_template.free_sign_name" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.freesignname2.touched && $validation.freesignname2.required">请输入短信签名</span>
                    <!-- <span v-if="$validation.freesignname2.modified && $validation.freesignname2.minlength">短信签名不能少于2位</span>
                    <span v-if="$validation.freesignname2.modified && $validation.freesignname2.maxlength">短信签名不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="controls col-15 col-offset-3">
                <div class="input-text-wrap">
                  <input v-model="dayu.forgot_template.template_code" type="text" placeholder="请输入模板ID" v-validate:templatecode2="{required: true}" name="dayu.forgot_template.template_code" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.templatecode2.touched && $validation.templatecode2.required">请输入模板ID</span>
                    <!-- <span v-if="$validation.templatecode2.modified && $validation.templatecode2.minlength">模板ID不能少于2位</span>
                    <span v-if="$validation.templatecode2.modified && $validation.templatecode2.maxlength">模板ID不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">更新帐号模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="dayu.update_template.free_sign_name" type="text" placeholder="请输入短信签名" v-validate:freesignname3="{required: true}" name="dayu.update_template.free_sign_name" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.freesignname3.touched && $validation.freesignname3.required">请输入短信签名</span>
                    <!-- <span v-if="$validation.freesignname3.modified && $validation.freesignname3.minlength">短信签名不能少于2位</span>
                    <span v-if="$validation.freesignname3.modified && $validation.freesignname3.maxlength">短信签名不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="controls col-15 col-offset-3">
                <div class="input-text-wrap">
                  <input v-model="dayu.update_template.template_code" type="text" placeholder="请输入模板ID" v-validate:templatecode3="{required: true}" name="dayu.update_template.template_code" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.templatecode3.touched && $validation.templatecode3.required">请输入模板ID</span>
                    <!-- <span v-if="$validation.templatecode3.modified && $validation.templatecode3.minlength">模板ID不能少于2位</span>
                    <span v-if="$validation.templatecode3.modified && $validation.templatecode3.maxlength">模板ID不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedType.value===2">
            <div class="form-row row">
              <label class="form-control col-3">SID:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.account_sid" type="text" placeholder="请输入SID" v-validate:accountsid="{required: true}" name="twilio.account_sid" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.accountsid.touched && $validation.accountsid.required">请输入SID</span>
                    <!-- <span v-if="$validation.accountsid.modified && $validation.accountsid.minlength">SID不能少于2位</span>
                    <span v-if="$validation.accountsid.modified && $validation.accountsid.maxlength">SID不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">TOKEN:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.auth_token" type="text" placeholder="请输入token" v-validate:authtoken="{required: true}" name="twilio.auth_token" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.authtoken.touched && $validation.authtoken.required">请输入TOKEN</span>
                    <!-- <span v-if="$validation.authtoken.modified && $validation.authtoken.minlength">TOKEN不能少于2位</span>
                    <span v-if="$validation.authtoken.modified && $validation.authtoken.maxlength">TOKEN不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">电话号码:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.from" type="text" placeholder="请输入电话号码" v-validate:from="{required: true}" name="twilio.from" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.from.touched && $validation.from.required">请输入电话号码</span>
                    <!-- <span v-if="$validation.from.modified && $validation.from.minlength">电话号码不能少于2位</span>
                    <span v-if="$validation.from.modified && $validation.from.maxlength">电话号码不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">注册帐号模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.register_template" type="text" placeholder="请输入模板内容" v-validate:registertemplate="{required: true}" name="twilio.register_template" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.registertemplate.touched && $validation.registertemplate.required">请输入模板内容</span>
                    <!-- <span v-if="$validation.registertemplate.modified && $validation.registertemplate.minlength">模板内容不能少于2位</span>
                    <span v-if="$validation.registertemplate.modified && $validation.registertemplate.maxlength">模板内容不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">忘记密码模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.forgot_template" type="text" placeholder="请输入模板内容" v-validate:forgottemplate="{required: true}" name="twilio.forgot_template" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.forgottemplate.touched && $validation.forgottemplate.required">请输入模板内容</span>
                    <!-- <span v-if="$validation.forgottemplate.modified && $validation.forgottemplate.minlength">模板内容不能少于2位</span>
                    <span v-if="$validation.forgottemplate.modified && $validation.forgottemplate.maxlength">模板内容不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">更新帐号模板:</label>
              <div class="controls col-15">
                <div class="input-text-wrap">
                  <input v-model="twilio.update_template" type="text" placeholder="请输入模板内容" v-validate:updatetemplate="{required: true}" name="twilio.update_template" class="input-text"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.updatetemplate.touched && $validation.updatetemplate.required">请输入模板内容</span>
                    <!-- <span v-if="$validation.updatetemplate.modified && $validation.updatetemplate.minlength">模板内容不能少于2位</span>
                    <span v-if="$validation.updatetemplate.modified && $validation.updatetemplate.maxlength">模板内容不能大于等于30位</span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row" v-if="type!=='add'">
            <div class="col-21 col-offset-3">
              <label class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除运营商
              </label>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-21 col-offset-3">
              <button class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
            </div>
          </div>
        </div>
      </form>
    </validation>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Select from 'components/Select'
import Pager from 'components/Pager'
import api from 'api'
// import _ from 'lodash'

export default {
  name: 'OperateForm',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    Pager
  },

  vuex: {},

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      selectedType: {
        label: '阿里大于',
        value: 1
      },
      typeOptions: [
        {
          label: '阿里大于',
          value: 1
        }, {
          label: 'Twilio',
          value: 2
        }
      ],
      desc: '',
      dayu: {
        server_url: '',
        app_key: '',
        app_secret: '',
        register_template: {
          free_sign_name: '',
          template_code: ''
        },
        forgot_template: {
          free_sign_name: '',
          template_code: ''
        },
        update_template: {
          free_sign_name: '',
          template_code: ''
        }
      },
      twilio: {
        account_sid: '',
        auth_token: '',
        from: '',
        register_template: '',
        forgot_template: '',
        update_template: ''
      },
      selectedProduct: {
        id: 0,
        label: '请选择产品'
      }, // 已选产品
      interval: {}, // 快照规则
      name: '', // 快照名称
      submitting: false,
      selectedDatapoints: [],
      allDatapoints: [],
      currentPage: 1,
      countPerPage: 10,
      delChecked: false,
      loadingData: false,
      ruleType: 'timer',
      countryCode: [],
      countryNums: [],
      selectedCode: {
        label: '+1(United States)',
        value: '+1'
      }
    }
  },
  created () {
    const FILE_NAMES = 'countryCode'
    this.$http.get(`/static/data/countryCode/${FILE_NAMES}.json`).then((res) => {
      this[FILE_NAMES] = res.data
    })
  },

  computed: {

  },

  watch: {},

  ready () {
    this.init()
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.type === 'add') {

      } else if (this.type === 'edit') {
        this.getCount()
      }
    },
    /**
     * 获取单个信息
     */
    getCount () {
      this.loadingData = true
      api.message.getCount(this.$route.params.id).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          console.log(res.data)
          this.name = res.data.name
          // this.selectedType = res.data.type
          if (res.data.type === 1) {
            // 阿里大于
            this.selectedType = {
              label: '阿里大于',
              value: 1
            }
          } else if (res.data.type === 2) {
            // Twilio
            this.selectedType = {
              label: 'Twilio',
              value: 2
            }
          }
          // this.area_code = res.data.area_code
          this.countryCode.forEach((item) => {
            if (item.value === res.data.area_code) {
              this.selectedCode = item
              return
            }
          })
          this.desc = res.data.desc
          if (res.data.type === 1) {
            // 阿里大于
            this.dayu = res.data.dayu
          } else if (res.data.type === 2) {
            // twilio
            this.twilio = res.data.twilio
          }
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    /**
     * 提交
     */
    onSubmit () {
      if (this.submitting) return

      if (this.delChecked && !window.confirm('您确定要删除该运营商?')) {
        return
      }
      if (!this.delChecked) { // 非删除
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
      }
      let process
      var params = {
        name: this.name,
        type: this.selectedType.value,
        area_code: this.selectedCode.value,
        desc: this.desc
      }
      if (params.type === 1) {
        // 如果是阿里大于类型
        params.dayu = this.dayu
      } else if (params.type === 2) {
        params.twilio = this.twilio
      }
      this.submitting = true
      if (this.type === 'add') { // 添加
        // console.log(params)
        process = api.message.addCount(params)
      } else {
        if (this.delChecked) { // 删除
          process = api.message.delCount(this.$route.params.id)
        } else {
          let accountId = this.$route.params.id
          process = api.message.editCount(accountId, params)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/settings/message/custom-carrier')
        }
      }).catch((res) => {
        this.submitting = false
        console.log(res.data)
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.form
  max-width 800px
  .input-lenght
    width 200px
  .rule-type-item
    display inline-block
  .ruletype-tips
    color #999
</style>
