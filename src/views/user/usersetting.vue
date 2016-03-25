<template lang="jade">
.panel
  .panel-hd
    h2  {{ $t("user.setting") }}
  .pane1-bd
    .form.pdb60set
      form(v-form, name="validation", @submit.prevent="onSubmit")
        .form-row.textcen
          input(type="checkbox",v-model="model.is_user_active")
          label  注册用户无需激活便可登录平台
        .form-row
          p.settingtit 第三方验证
        .form-row
          label.form-control URL:
          .controls
            .input-text-wrap(v-placeholder="'请输入URL'")
              input.input-text(v-model="model.user_auth_third.url",type="text",placeholder='',name='url',custom-validator="noSpacesPrefixAndSuffix", required)
            //- .form-tips.form-tips-error(v-if="validation.$submitted && validation.url.$pristine")
            //-   span(v-if="validation.url.$error.required") URL不可为空
        .form-row
          label.form-control Token:
          .controls
            .input-text-wrap(v-placeholder="'请输入Token'")
              input.input-text(v-model="model.user_auth_third.token",type="text",name="token",custom-validator="noSpacesPrefixAndSuffix", required)
            //- .form-tips.form-tips-error(v-if="validation.$submitted && validation.token.$pristine")
            //-   span(v-if="validation.token.$error.required") Token不可为空
        .form-actions
          button.btn.btn-primary.btn-lg(type="submit") {{ '確定' }}
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
  import api from '../../api';

  export default {
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
      };
    },

    ready: function () {
      this.getData();
      // this.model.is_user_active = this.getUserSetting('is_user_active');
      // this.model.user_auth_third.url = this.getUserSetting('user_auth_third.url');
      // this.model.user_auth_third.token = this.getUserSetting('user_auth_third.token');
    },

    methods: {
      getData () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.corp.getUserSetting(self.model).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            self.model = data;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },
      onSubmit () {
        var self = this;
        if (self.validation.$valid) {
          api.corp.refreshToken().then(function () {
            api.corp.updateUserSetting(self.model).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              alert('已成功修改！');
              // self.$route.router.go({path: '/corp/' + data.id});
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      }
    }
  };
</script>
