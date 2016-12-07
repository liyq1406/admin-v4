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
                    <label class="form-control col-5 organization-label">{{ $t('operation.dealer.fields.account') }}:</label>
                    <div class="controls col-19">
                      <div v-placeholder="$t('operation.heavy_buyer.placeholders.account')" class="input-text-wrap">
                        <input v-model="model.username" name="model.username" v-validate:username="{required: true, format: ['account', 'email'], minlength: 6, maxlength: 32}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.username.touched && $validation.username.required">{{ $t('common.validation.required', {field: $t('operation.heavy_buyer.fields.account')}) }}</span>
                        <span v-if="$validation.username.modified && $validation.username.format">{{ $t('common.validation.account') }}</span>
                        <span v-if="$validation.username.modified && $validation.username.minlength">{{ $t('common.validation.minlength', [$t('operation.heavy_buyer.fields.account'), 6]) }}</span>
                        <span v-if="$validation.username.modified && $validation.username.maxlength">{{ $t('common.validation.maxlength', [$t('operation.heavy_buyer.fields.account'), 32]) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row mt20">
                    <label class="form-control col-5 organization-label">{{ $t('operation.heavy_buyer.fields.password') }}:</label>
                    <div class="controls col-19">
                      <button class="btn btn-ghost mb10" v-if="type==='edit'" @click.prevent.stop="editPassword = !editPassword">修改密码</button>
                      <div class="controls col-19" v-if="type === 'add' || editPassword">
                        <div v-placeholder="$t('operation.heavy_buyer.placeholders.password')" class="input-text-wrap">
                          <input v-model="model.password" type="text" lazy name="model.password" v-validate:password="{required: true, format: 'password'}" class="input-text"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.password.touched && $validation.password.required">{{ $t('common.validation.required', {field: $t('operation.heavy_buyer.fields.password')}) }}</span>
                          <span v-if="$validation.password.modified && $validation.password.format">{{ $t('common.validation.password') }}</span>
                        </div>
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
                    <label class="form-control col-5 organization-label">{{ $t('operation.heavy_buyer.fields.contacter') }}:</label>
                    <div class="controls col-19">
                      <div v-placeholder="$t('operation.heavy_buyer.placeholders.contacter')" class="input-text-wrap">
                        <input type="text" v-model="model.contacter" name="model.contacter" v-validate:name="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('operation.heavy_buyer.fields.contacter')}) }}</span>
                        <span v-if="$validation.name.modified && $validation.name.minlength">{{ $t('common.validation.minlength', [$t('operation.heavy_buyer.fields.contacter'), 2]) }}</span>
                        <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('operation.heavy_buyer.fields.contacter'), 32]) }}</span>
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
              <div class="form-row row" v-if="false && type==='edit'">
                <div class="col-21 col-offset-1">
                  <label class="del-check">
                    <input type="checkbox" name="del" v-model="delChecked"/> {{ $t('common.del') }}
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="part col-14 row max-width">
                  <div class="form-actions offset-5 mt10">
                    <button type="submit" :disabled="(submitting || $validation.invalid) && !delChecked" :class="{'disabled':(submitting || $validation.invalid) && !delChecked}" class="ml20 btn btn-primary btn-lg">提交</button>
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
  import api from 'api'

  export default {

    name: 'AccountForm',

    components: {
    },

    data () {
      return {
        editPassword: false,
        selectedRole: {
          label: '管理员',
          value: 1
        },
        roleOptions: [
          {
            label: '管理员',
            value: 1
          },
          {
            label: '普通成员',
            value: 2
          }
        ],
        selectedOrganization: {
          label: '请选择组织'
        },
        organizations: [],
        model: {
          username: '',
          password: '',
          organization: '',
          contacter: '',
          contact_way: ''
        },
        majorClient: {},
        submitting: false,
        delChecked: false,
        user: {}
      }
    },

    computed: {
      organizationOptions () {
        let res = []
        if (this.majorClient.name) {
          res.push({
            id: '0',
            label: this.majorClient.name
          })
        }
        this.organizations.forEach((item) => {
          res.push({
            id: item.id,
            label: item.name
          })
        })
        return res
      },
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
        this.getMajorClient()
        if (this.type === 'edit') {
          this.getUsers()
        }
      }
    },

    ready () {
    },

    methods: {
      getUsers (reset) {
        let params = {
          query: {
            id: {'$in': [this.$route.params.accountId]}
          }
        }
        api.heavyBuyer.getOrganizationUsers(this.$route.params.id, params).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            let user = res.data.list[0]
            this.model.username = user.username
            this.model.contacter = user.contacter
            this.model.contact_way = user.contact_way
            let finded = _.find(this.roleOptions, (item) => {
              return item.value === user.role
            })
            if (finded) {
              this.selectedRole = finded
            }
            this.user = user
            this.setDefaultOrg()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      getOrganization () {
        api.heavyBuyer.getOrganizationList(this.$route.params.id, {}).then((res) => {
          if (res.status === 200) {
            this.organizations = res.data.list
            this.setDefaultOrg()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      setDefaultOrg () {
        let finded = _.find(this.organizationOptions, (item) => {
          return item.id === this.user.organization
        })
        if (finded) {
          this.selectedOrganization = finded
        }
      },
      onSubmit () {
        if (this.submitting) return

        if (this.delChecked && !window.confirm(this.$t('operation.user.major.comfirm_del'))) {
          return
        }

        if (this.$validation.invalid && !this.delChecked) {
          this.$validate(true)
          return
        }

        if (!typeof this.selectedOrganization.id === 'string') {
          this.showNotice({
            type: 'error',
            content: '请选择组织'
          })
          return
        }

        let params = {
          username: this.model.username,
          contacter: this.model.contacter,
          contact_way: this.model.contact_way,
          role: this.selectedRole.value,
          organization: this.selectedOrganization.id
        }

        if (this.model.password) {
          params.password = this.model.password
        }

        let process

        this.submitting = true
        if (this.type === 'add') { // 添加
          process = api.heavyBuyer.createUser(this.$route.params.id, params)
        } else {
          if (this.delChecked) { // 删除
            process = api.heavyBuyer.delUser(this.$route.params.id, this.$route.params.accountId)
          } else {
            process = api.heavyBuyer.editUser(this.$route.params.id, this.$route.params.accountId, params)
          }
        }
        process.then((res) => {
          this.submitting = false
          if (res.status === 200) {
            this.$route.router.replace('/operation/major-clients/' + this.$route.params.id + '/account')
          }
        }).catch((res) => {
          this.submitting = false
          this.handleError(res)
        })
      },
      getMajorClient () {
        var params = {
          filter: [
            'name'
          ],
          limit: 1,
          query: {
            'id': { $in: [this.$route.params.id] }
          }
        }
        api.heavyBuyer.getHeavyBuyer(params).then((res) => {
          if (res.status === 200) {
            this.majorClient = res.data.list[0]
            this.setDefaultOrg()
          }
        }).catch((err) => {
          this.handleError(err)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .x-major-clients-account-form
    .form
      max-width 800px
    .part
      margin-top 10px
      margin-bottom 20px
    .organization-label
      line-height 32px
      padding-left 20px
      box-sizing border-box
</style>
