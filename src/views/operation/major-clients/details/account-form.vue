<template>
  <div class="main x-major-clients-account-form">
    <div class="main-title">
      <h2>{{title}}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="validation">
      <div class="form">
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
                        <input v-model="model.username" name="model.username" v-validate:username="{required: true, format: 'account'}" lazy class="input-text"/>
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
                        <input v-model="model.password" type="text" name="model.password" v-validate:password="{required: true, minlength: 6, maxlength: 16}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.password.touched && $validation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                        <span v-if="$validation.password.modified && $validation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 6]) }}</span>
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
                    <label class="form-control col-5 organization-label">角色:</label>
                    <div class="controls col-19">
                      <x-select :label="selectedRole.label">
                        <select v-model="selectedRole">
                          <option v-for="option in roleOptions" :value="option">{{ option.label }}</option>
                        </select>
                      </x-select>
                    </div>
                  </div>

                  <div class="form-row row mt20">
                    <label class="form-control col-5 organization-label">所属组织:</label>
                    <div class="controls col-19">
                      <x-select :label="selectedOrganization.label">
                        <select v-model="selectedOrganization">
                          <option v-for="option in organizationOptions" :value="option">{{ option.label }}</option>
                        </select>
                      </x-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-hd bordered mt20">
              <h2>联系信息</h2>
            </div>
            <div class="panel-bd">
              <div class="row">
                <div class="part col-14 max-width">
                  <div class="form-row row">
                    <label class="form-control col-5 organization-label">联系人:</label>
                    <div class="controls col-19">
                      <div v-placeholder="'请输入联系人'" class="input-text-wrap">
                        <input type="text" v-model="model.contacter" name="model.contacter" v-validate:name="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('operation.dealer.dealer_name')}) }}</span>
                        <span v-if="$validation.name.modified && $validation.name.minlength">{{ $t('common.validation.minlength', [$t('operation.dealer.dealer_name'), 2]) }}</span>
                        <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('operation.dealer.dealer_name'), 32]) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-row row mt20">
                    <label class="form-control col-5 organization-label">联系电话:</label>
                    <div class="controls col-19">
                      <div v-placeholder="'请输入联系电话'" class="input-text-wrap">
                        <input type="text" v-model="model.contact_way" name="model.contact_way" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.phone.touched && $validation.phone.required">请输入联系电话</span>
                        <span v-if="$validation.phone.modified && $validation.phone.format">请输入正确的联系电话</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="panel-hd bordered mt20">
            </div>
            <div class="panel-bd">
              <div class="row">
                <div class="part col-14 row max-width">
                  <div class="form-actions offset-5 mt20">
                    <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="ml20 btn btn-primary btn-xlg">提交</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
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
        selectedRole: {
          label: '普通成员',
          value: 1
        },
        roleOptions: [
          {
            label: '普通成员',
            value: 1
          },
          {
            label: '管理员',
            value: 2
          }
        ],
        selectedOrganization: {
          label: '请选择组织',
          value: 0
        },
        organizationOptions: [],
        model: {
          username: '',
          password: '',
          role: 1,
          organization: '',
          contacter: '',
          contact_way: ''
        }
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
        this.getOrganization()
      }
    },

    methods: {
      getOrganization () {
        this.organizationOptions = [
          {
            label: '请选择组织',
            value: 0
          }
        ]
      },
      onSubmit () {
        console.log('提交')
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .x-major-clients-account-form
    .form
      max-width none
    .part
      margin-top 10px
      margin-bottom 20px
    .organization-label
      line-height 32px
      padding-left 20px
      box-sizing border-box
</style>
