<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('ui.user.setting') }}</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <form autocomplete="off" v-form name="validation" @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="checkbox">
                <input type="checkbox" v-model="model.is_user_active"/>
                <span>用户必须激活方可登录平台</span>
              </label>
              <i class="fa fa-question-circle hl-orange" v-tooltip="'若没有设置该项目，那么：<br>1. 手机注册的用户不需要输入验证码便可注册并且激活。<br>2. 邮箱注册的用户，无需点击邮箱中的激活链接，便可登录平台'"></i>
            </div>
            <p>第三方验证</p>
            <div class="form-row row">
              <label class="form-control col-5">URL:</label>
              <div class="controls col-19">
                <div v-placeholder="'请输入URL'" class="input-text-wrap">
                  <input v-model="model.user_auth_third.url" type="text" placeholder="" name="url" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-5">Token:</label>
              <div class="controls col-19">
                <div v-placeholder="'请输入Token'" class="input-text-wrap">
                  <input v-model="model.user_auth_third.token" type="text" name="token" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions row">
              <div class="col-offset-5">
                <button type="submit" class="btn btn-primary btn-xlg">{{ '确定' }}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  export default {
    name: 'UserSetting',
    data () {
      return {
        validation: {},
        model: {
          is_user_active: '',
          user_auth_third: {
            'url': '',
            'token': ''
          }
        }
      }
    },

    ready () {
      this.getData()
      // this.model.is_user_active = this.getUserSetting('is_user_active')
      // this.model.user_auth_third.url = this.getUserSetting('user_auth_third.url')
      // this.model.user_auth_third.token = this.getUserSetting('user_auth_third.token')
    },

    methods: {
      getData () {
        api.corp.getUserSetting(this.model).then((res) => {
          // this.model = res.data
          this.model.is_user_active = res.data.is_user_active
          this.model.user_auth_third = res.data.user_auth_third
        }).catch((res) => {
          this.handleError(res)
        })
      },

      onSubmit () {
        if (this.validation.$valid) {
          var params = {
            is_user_active: this.model.is_user_active,
            user_auth_third: this.model.user_auth_third
          }
          api.corp.updateUserSetting(params).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: '修改成功！'
              })
            }
            this.getData()
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>
