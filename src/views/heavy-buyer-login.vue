<template>
  <div>
    <loginarea :config="config"></loginarea>
    <div class="auth-form login-form">
      <!-- 无权限时登录页面 -->
      <div class="inner unableinner" v-if="!ableLog">
        <p>该大客户暂无登录权限，</p>
        <p>请联系相关工作人员开启对应入口权限</p>
      </div>
      <div class="inner" v-else>
        <div class="form-legend">{{config.login_context}}</div>
        <div class="form">
          <validator name="authValidation">
            <form novalidate @submit.prevent="onSubmit">
              <div class="form-row">
                <div v-placeholder="$t('auth.email_phone')" class="input-text-wrap">
                  <input type="text" v-model="model.username" name="model.username" v-validate:account="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$authValidation.account.touched && $authValidation.account.required">{{ $t('common.validation.required', {field: $t('auth.fields.account')}) }}</span>
                </div>
              </div>
              <div class="form-row">
                <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                  <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                </div>
              </div>
              <div class="form-row row-check">
                <!-- <a v-link="{ path: '/fetch-password-bymail' }">{{ $t("auth.forget") }}</a> -->
                <label class="checkbox">
                  <input type="checkbox" v-model="rememberPwd"/>{{ $t("auth.remember") }}
                </label>
              </div>
              <div class="form-actions">
                <button @keyup.enter="onSubmit" :disabled="logining" :class="{'disabled':logining}" v-text="logining ? $t('auth.login_submitting') : $t('auth.login_submit')" class="btn btn-primary btn-xxlg btn-pill focus-input">{{ $t("auth.login_submit") }}</button>
              </div>
              <!-- <div class="form-operations"><a v-link="{ path: '/register' }">{{ $t("auth.register") }}</a></div> -->
            </form>
          </validator>
        </div>
      </div>
      <div class="extra-actions">
        <!-- <div class="old-entrance" v-if="isShowOldEntrance">
          <a href="http://admin-v3.xlink.cn/" target="_blank">{{ $t('auth.old_entrance') }} &gt;</a>
        </div> -->
        <div class="lang-switcher">
          <a href="#" :class="{'active': currLang === 'zh-cn'}" @click.prevent.stop="switchLanguage('zh-cn')">中文</a> / <a href="#" :class="{'active': currLang === 'en-us'}"  @click.prevent.stop="switchLanguage('en-us')">English</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import { setLoadingStatus } from 'store/actions/system'
  import { IS_SHOW_OLD_ENTRANCE } from 'consts/config'
  import Loginarea from 'components/other/layout/Loginarea'

  export default {
    name: 'LoginForm',

    layouts: ['auth'],
    vuex: {
      getters: {
        logining: ({ system }) => system.loading
      },
      actions: {
        setLoadingStatus
      }
    },
    components: {
      Loginarea
    },

    data () {
      return {
        able: false,
        productAble: false,
        moduleAble: false,
        config: {},
        currLang: window.localStorage.getItem('lang'),
        isShowOldEntrance: IS_SHOW_OLD_ENTRANCE,
        model: {
          username: '',
          password: ''
        },
        isLoginSuccess: false,
        rememberPwd: Boolean(this.getCookie('rememberPwd')) || false
      }
    },

    route: {
      deactivate () {
        // 清除插件的token
        window.localStorage.removeItem('pluginsToken')
        // this.setLoadingStatus(false)
        if (this.isLoginSuccess) {
          this.showNotice({
            type: 'success',
            content: this.$t('auth.login_success')
          })
        }
      }
    },

    ready () {
      this.getConfig()
      // 清除大客户等用户登录标识
      window.localStorage.removeItem('userRole')
      this.setLoadingStatus(false)
      if (this.rememberPwd) {
        this.model.username = this.getCookie('account')
        this.model.password = this.getCookie('password')
      }
      this.focus()
    },
    computed: {
      ableLog () {
        var result = this.able && this.productAble && this.moduleAble
        return result
      }
    },

    methods: {
      // 获取配置信息
      getConfig () {
        // sssssw
        if (!this.$route.params.heavyBuyerId || !this.$route.params.corpId) return

        api.heavyBuyer.getConfig(this.$route.params.heavyBuyerId, this.$route.params.corpId).then((res) => {
          console.log(res)
          this.config = res.data
          // 先判断总配置开关
          if (this.config.is_enable) {
            this.able = true
          }
          // 再判断是否有产品打开授权
          this.config.product.forEach((item) => {
            if (item.is_visible) {
              this.productAble = true
            }
          })
          // 最后判断是否有模块打开授权
          this.config.module.forEach((item) => {
            if (item.is_visible) {
              this.moduleAble = true
            }
          })
          let value = JSON.stringify(res.data)
          window.localStorage.setItem('heavyBuyerConfig', value)
          // if (this.model.logo_url) {
          //   this.images[0] = this.model.logo_url
          // }
        }).catch((err) => {
          this.handleError(err)
        })
      },
      /**
       * 切换语言
       */
      switchLanguage (lang) {
        if (lang !== this.currLang) {
          this.currLang = lang
          window.localStorage.setItem('lang', lang)
          Vue.config.lang = lang
          document.location.reload()
        }
      },

      // 设置 Cookies
      setCookie (name, value) {
        var Days = 30
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
      },

      // 读取 Cookies
      getCookie (name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        var arr = document.cookie.match(reg) || {}
        if (arr.length) {
          return unescape(arr[2])
        } else {
          return null
        }
      },

      // 删除 Cookies
      delCookie (name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null) {
          document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
        }
      },

      loginFormHook (form) {
        this.loginForm = form
      },

      onSubmit () {
        if (this.$authValidation.valid) {
          this.setLoadingStatus(true)
          this.model.heavy_buyer_id = this.$route.params.heavyBuyerId
          api.heavyBuyer.auth(this.model).then((res) => {
            var today = new Date()
            // window.localStorage.clear()
            window.localStorage.removeItem('pluginsToken')
            window.localStorage.removeItem('memberRole')
            // 清除经销商配置
            window.localStorage.removeItem('dealerConfig')
            // 用户角色，1表示大客户
            window.localStorage.setItem('memberId', res.data.member_id)
            window.localStorage.setItem('corpId', this.$route.params.corpId)
            window.localStorage.setItem('accessToken', res.data.access_token)
            window.localStorage.setItem('refreshToken', res.data.refresh_token)
            window.localStorage.setItem('expireIn', res.data.expire_in)
            window.localStorage.setItem('expireAt', today.getTime() + res.data.expire_in * 1000)
            window.localStorage.setItem('userRole', 'heavy-buyer')
            window.localStorage.setItem('heavyBuyerId', this.$route.params.heavyBuyerId)
            // window.localStorage.setItem('expireAt', today.getTime() + 10000)
            // 设置记住密码
            if (this.rememberPwd) {
              this.setCookie('rememberPwd', true)
              this.setCookie('account', this.model.username)
              this.setCookie('password', this.model.password)
            } else {
              this.delCookie('rememberPwd')
              this.delCookie('account')
              this.delCookie('password')
            }
            this.isLoginSuccess = true
            this.$emit('login-success')
            // 登陆成功后跳转逻辑
            this.jump()
            // api.custom.empty() // 清除api缓存
            // api.product.all().then((res) => {
            //   this.$route.router.replace({path: `/operation/products/${res.data[0].id}/overview`})
            // })
          }).catch((res) => {
            this.setLoadingStatus(false)
            this.handleError(res)
          })
        }
      },

      // 登陆后跳转逻辑
      jump () {
        var firProductId = ''
        var modePage = ''
        var ableStopModel = false
        var ableStopProduct = false
        var routeArr = {
          'summary': '/overview',
          'device_list': '/devices',
          'alert': '/alerts',
          'device_map-map': '/device-map',
          'analyse': '/analysis'
        }
        var PRO_SUBS = ['summary', 'device_list', 'alert', 'device_map-map', 'analyse']
        // 先确认是否产品内有打开的模块
        this.config.product.forEach((item) => {
          if (item.is_visible && !modePage) {
            firProductId = item.product_id
            PRO_SUBS.forEach((type) => {
              this.config.module.forEach((mode) => {
                if (type === mode.type && mode.is_visible && !modePage) {
                  modePage = mode.type
                  console.log(modePage)
                  ableStopModel = true
                  return
                }
              })
            })
            ableStopProduct = true
            return
          }
        })
        console.log(firProductId, modePage)
        if (ableStopProduct && ableStopModel) {
          this.$route.router.replace({path: `/operation/products/${firProductId}${routeArr[modePage]}`})
          return
        }
        // 产品相关模块没开启跑下面流程
        // api.plugin.all().then((res) => {
        //   if (res.status === 200) {
        //     console.log(res.data)
        //     this.config.module.forEach((mode) => {
        //       // 判断是否有维保开启
        //       if (mode.type === 'warranty' && mode.is_visible) {
        //         res.data.list.forEach((item) => {
        //           if (item.plugin === 'warranty') {
        //             this.$route.router.replace({path: '/operation/plugins/warranty/' + item.id + '/work-orders/repair'})
        //           }
        //         })
        //       } else if (mode.type === 'helpdesk' && mode.is_visible) {
        //         res.data.list.forEach((item) => {
        //           if (item.plugin === 'helpdesk') {
        //             this.$route.router.replace({path: '/operation/plugins/helpdesk/' + item.id + '/overview'})
        //           }
        //         })
        //       }
        //     })
        //   }
        // }).catch((res) => {
        //   this.handleError(res)
        // })
        // api.product.all().then((res) => {
        //   this.$route.router.replace({path: `/operation/products/${res.data[0].id}/overview`})
        // })
      },

      /**
       * 首次进入光标移入密码框 然后移动到登录按钮  以解决浏览器记住密码时候v-placeholder的bug
       * @return {[type]} [description]
       */
      focus () {
        var focusInputs = document.getElementsByClassName('focus-input')
        for (var i = 0; i < focusInputs.length; i++) {
          setTimeout(((i) => {
            return function () {
              focusInputs[i].focus()
            }
          })(i), 50 * i)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../assets/stylus/common'
  .unableinner
    height 201px
    text-align center
    padding-top 100px
    p
      font-size 16px

  .login-form
    .inner
      padding-bottom: 40px;
    .row-check
      a
        float right

  // 页脚
  .reg-footer
    .copyright
      color #FFF
      text-align center
      margin 80px 0

  .loading-resource
    .form-auth
      .form-actions
        .btn
          cursor wait

  .extra-actions
    width 500px
    margin 10px auto 0
    color #CCC
    clearfix()

    a
      color #CCC

      &:hover
        color #FFF
        text-decoration underline

      &.active
        color #FFF

    .lang-switcher
      margin-left 10px

    .old-entrance
      float right
      margin-right 10px
</style>
