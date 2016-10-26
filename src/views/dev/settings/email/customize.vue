<template lang="html">
  <div class="form">
    <validator name="validation">
      <form autocomplete="off" novalidate @submit.prevent="onSubmit">
        <div class="panel">
          <div class="panel-bd">
            <div class="email-type-list mt30 ml20">
              <ul>
                <li v-for="type in emailTypes">
                  <input v-model="emailType" type="radio" :value="type.value" name="email-type"/>
                  <label>{{type.label}}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="panel top-bordered" v-if="emailType === 1">
          <div class="panel-bd smtp-setting ml30 mt15">
            <div class="form-row row">
              <div class="form-control col-4">
                <label>URL:</label>
              </div>
              <div class="controls col-14">
                <div class="input-text-wrap">
                  <input v-model="customizeModel.url" type="text" placeholder="请输入URL" class="input-text" v-validate:url="{required: true}"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.url.touched && $validation.url.required">URL不能为空</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-4">
                <label>TOKEN:</label>
              </div>
              <div class="controls col-14">
                <div class="input-text-wrap">
                  <input v-model="customizeModel.token" type="text" placeholder="请输入TOKEN" class="input-text" v-validate:token="{required: true}"/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.token.touched && $validation.token.required">TOKEN不能为空</span>
                  </div>
                </div>
              </div>
              <div class="form-actions col-6">
                <div class="line-height-30 fr">
                  <button :disabled="!verificateShow || customizeModel.success || customizeModel.checking" :class="{'disabled': !verificateShow || customizeModel.success || customizeModel.checking}" class="btn btn-primary w100" @click.prevent.stop="verificateUrl">{{checkLabel}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel top-bordered" v-if="emailType === 2">
          <div class="panel-bd smtp-setting ml30 mt15">
            <div class="form-row row">
              <div class="form-control col-4">
                <label>类型:</label>
              </div>
              <div class="controls col-18">
                <div class="input-radio-wrap">
                  <input v-model="connectModel.type" type="radio" value="0" name="connect-type"/>
                  <label>TLS</label>
                  <input v-model="connectModel.type" type="radio" value="1" name="connect-type"/>
                  <label>SSL</label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-4">
                <label>帐号:</label>
              </div>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="connectModel.email" type="text" placeholder="请输入邮箱帐号" class="input-text" v-validate:name="{required: true, format: 'email'}" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.format">邮箱格式不正确</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-4">
                <label>密码:</label>
              </div>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="connectModel.password" type="password" placeholder="请输入邮箱密码" class="input-text" v-validate:passwd="{required: true}" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.passwd.touched && $validation.passwd.required">邮箱密码不能为空</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-4">
                <label>smtp host:</label>
              </div>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="connectModel.host" type="text" placeholder="请输入smtp host" class="input-text" v-validate:host="{required: true}" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.host.touched && $validation.host.required">smtp host 不能为空</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-4">
                <label>smtp port:</label>
              </div>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="connectModel.port" type="text" placeholder="请输入smtp port" class="input-text" v-validate:port="{required: true}" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.port.touched && $validation.port.required">smtp host 不能为空</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-actions col-offset-2">
            <button type="submit" :disabled="submitting || $validation.invalid || (emailType===1 && !customizeModel.check)" :class="{'disabled':submitting || $validation.invalid || (emailType===1 && !customizeModel.success)}" v-text="submitting ? $t('common.handling') : $t('common.save')" class="btn btn-primary w100"></button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import {get} from 'src/http'
import { globalMixins } from 'src/mixins'
import JSSHA from 'jssha'

export default {
  name: 'customize-email',

  mixins: [globalMixins],

  vuex: {
    getters: {
      corp: ({ system }) => system.corp
    }
  },
  data () {
    return {
      submitting: false,
      connectModel: {
        type: 0,
        host: '',
        port: '',
        email: '',
        password: ''
      },
      customizeModel: {
        url: '',
        token: '',
        checking: false,
        success: false
      },
      emailType: 0,
      emailTypes: [{
        value: 0,
        label: '使用云智易默认邮件模版'
      }, {
        value: 1,
        label: '使用第三方厂商邮件'
      }, {
        value: 2,
        label: 'SMTP设置'
      }
      ]
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
  ready () {},
  methods: {
    /**
     * 提交按钮
     * @return {[type]} [description]
     */
    onSubmit () {
      // 如果表单正在提交，禁止二次提交
      if (this.submitting) return

      // 如果表单验证不通过则重新验证
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 开始提交表单
      this.submitting = true
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.email-type-list
  ul
    li
      margin-top 20px
.input-radio-wrap
  position relative
  line-height 30px
  display inline-block
  input, label
    vertical-align middle
  label
    margin-right 20px
.top-bordered
  border-top 1px solid default-border-color
.line-height-30
  line-height 30px
  vertical-align middle
</style>
