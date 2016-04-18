<template>
  <div class="panel">
    <div class="panel-hd">
      <h2> {{ $t("user.setting") }}</h2>
    </div>
    <div class="pane1-bd">
      <div class="form pdb60set">
        <form v-form name="validation" @submit.prevent="onSubmit">
          <div class="form-row textcen">
            <input type="checkbox" v-model="model.is_user_active"/>
            <label> 注册用户无需激活便可登录平台</label>
          </div>
          <div class="form-row">
            <p class="settingtit">第三方验证</p>
          </div>
          <div class="form-row">
            <label class="form-control">URL:</label>
            <div class="controls">
              <div v-placeholder="'请输入URL'" class="input-text-wrap">
                <input v-model="model.user_auth_third.url" type="text" placeholder="" name="url" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">Token:</label>
            <div class="controls">
              <div v-placeholder="'请输入Token'" class="input-text-wrap">
                <input v-model="model.user_auth_third.token" type="text" name="token" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg">{{ '确定' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.form-row.textcen
  margin-top  20px

.settingtit
  margin-top 0
  margin-bottom 0

.pdb60set
  padding 30px 0 60px
</style>

<script>
  import api from '../../api'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'UserSetting',

    layout: 'admin',

    mixins: [globalMixins],

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
          this.model.user_auth_third = res.data.user_auth_third
          this.model.is_user_active = !res.data.is_user_active
        }).catch((res) => {
          this.handleError(res)
        })
      },

      onSubmit () {
        if (this.validation.$valid) {
          var params = {
            is_user_active: !this.model.is_user_active,
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
