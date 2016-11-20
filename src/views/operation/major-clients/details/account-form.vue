<template>
  <div class="main x-major-clients-account-form">
    <div class="main-title">
      <h2>{{title}}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="validation">
      <form autocomplete="off" novalidate @submit.prevent="onSubmit">
        <div class="panel">
          <div class="panel-hd bordered mt20">
            <h2>账户信息</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="part col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 organization-label">帐号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.dealer.placeholders.account')" class="input-text-wrap">
                      <input :disabled="type === 'edit'" v-model="" name="" v-validate:username="{required: true, format: 'account'}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.username.touched && $validation.username.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                      <span v-if="$validation.username.modified && $validation.username.format">{{ $t('operation.dealer.placeholders.account') }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 organization-label">登录密码:</label>
                  <div class="controls col-19" v-if="type === 'add'">
                    <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
                      <input v-model="" type="text" name="" v-validate:password="{required: true, minlength: 8, maxlength: 16}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.password.touched && $validation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                      <span v-if="$validation.password.modified && $validation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 8]) }}</span>
                      <span v-if="$validation.password.modified && $validation.password.maxlength">{{ $t('common.validation.maxlength', [$t('auth.fields.password'), 16]) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-hd bordered mt20">
            <h2>组织信息</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="part col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 organization-label">所属组织:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input type="text" v-model="" name="" v-validate:name="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('operation.dealer.dealer_name')}) }}</span>
                      <span v-if="$validation.name.modified && $validation.name.minlength">{{ $t('common.validation.minlength', [$t('operation.dealer.dealer_name'), 2]) }}</span>
                      <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('operation.dealer.dealer_name'), 32]) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-actions mt20">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary fr">提交</button>
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
  // import api from 'api'
  // import formatDate from 'filters/format-date'

  export default {

    name: 'AccountForm',

    components: {
    },

    data () {
      return {
      }
    },

    computed: {
      type () {
        return this.$route.params.accountId ? 'edit' : 'add'
      },
      title () {
        return this.type === 'add' ? '添加账户' : '编辑账户'
      },
      breadcrumbNav () {
        return [{
          label: '大客户管理',
          link: '/operation/major-clients'
        }, {
          label: '大客户信息',
          link: `/operation/major-clients/${this.$route.params.id}/account`
        }, {
          label: this.title
        }]
      }
    },

    route: {
      data () {
      }
    },

    methods: {
      onSubmit () {
        console.log('提交')
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .x-major-clients-account-form
    .part
      margin-top 10px
      margin-bottom 20px
    .organization-label
      line-height 32px
      padding-left 20px
      box-sizing border-box
</style>
