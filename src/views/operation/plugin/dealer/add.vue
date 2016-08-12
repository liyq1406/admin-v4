<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="autoValidation">
      <form novalidate @submit.prevent="onSubmit">
        <div class="panel no-split-line">
          <div class="panel-hd bordered mt20">
            <h2>{{accountTitle}}</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="col-14">
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">账号:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.code')" class="input-text-wrap">
                      <input v-model="dealer.username" type="email" name="dealer.username" minlength="2" maxlength="32" v-validate:username="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.username.touched && $autoValidation.username.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">登录密码:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
                      <input v-model="dealer.password" type="text" name="dealer.password" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                    </div>
                  </div>
                </div>
                  <!-- </form>
                </validator> -->
              </div>
            </div>
          </div>
        </div>
        <div class="panel no-split-line">
          <div class="panel-hd bordered mt20">
            <h2>{{dealerTitle}}</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="col-14">
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">经销商名称:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input type="text" v-model="dealer.name" name="dealer.name" minlength="2" maxlength="32" v-validate:name="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.name.touched && $autoValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">联系人:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.contact')" class="input-text-wrap">
                      <input type="text" v-model="dealer.linkman" name="dealer.linkman" minlength="6" maxlength="16" v-validate:linkman="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.linkman.touched && $autoValidation.linkman.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">手机号:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.phone')" class="input-text-wrap">
                      <input type="text" v-model="dealer.phone" name="dealer.phone" minlength="6" maxlength="16" v-validate:phone="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">联系地址:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.address')" class="input-text-wrap">
                      <input type="text" v-model="dealer.address" name="dealer.address" minlength="6" maxlength="16" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.address.touched && $autoValidation.address.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.address')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">负责区域:</label>
                  <div class="controls col-16">
                    <div v-placeholder="$t('ui.dealer.placeholders.area')" class="input-text-wrap">
                      <input type="text" v-model="dealer.area" name="dealer.area" minlength="6" maxlength="16" v-validate:dutyarea="{required: true}" lazy  class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.dutyarea.touched && $autoValidation.dutyarea.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 ml20 dealer-label">从属于:</label>
                  <div class="controls col-16">
                    <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input v-model="addModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
                    </div> -->
                    <v-select width="100px" :label="belongType.label">
                      <select v-model="dealer.belongTo">
                        <option v-for="option in belongs" :value="option.value">{{ option.label }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
                <div class="form-actions mt20">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary fr dealer-add-sumit">提交</button>
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
  // import locales from 'consts/locales/index'
  import api from 'api'
  // import _ from 'lodash'
  import Breadcrumb from 'components/Breadcrumb'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'TableDetails',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      Breadcrumb
    },

    data () {
      return {
        sending: false,
        type: '',
        dealer: {
          _id: '',
          username: '',
          password: '',
          name: '',
          linkman: '',
          phone: '',
          address: '',
          area: '',
          belongTo: ''
        },
        belongs: [
          { label: '广州分部', value: '广州分部' }
        ],
        belongType: {
          label: '广州分部',
          value: '广州分部'
        },
        breadcrumbNav: [{
          label: '全部',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
        }, {
          label: '添加经销商'
        }]
      }
    },

    computed: {
      accountTitle () {
        if (this.type === 'add') {
          return '添加账户信息'
        } else if (this.type === 'edit') {
          return '编辑账户信息'
        }
      },
      dealerTitle () {
        if (this.type === 'add') {
          return '添加经销商信息'
        } else if (this.type === 'edit') {
          return '编辑经销商信息'
        }
      }
    },

    route: {
      data () {
        if (this.$route.params.id) {
          this.type = 'edit'
          this.breadcrumbNav[1].label = '编辑经销商'
          this.getDealer(this.$route.params.id)
        } else {
          this.breadcrumbNav[1].label = '添加经销商'
          this.type = 'add'
        }
      }
    },

    ready () {
    },
    methods: {
      onSubmit () {
        if (this.$autoValidation.valid && !this.sending) {
          if (this.type === 'add') {
            this.addDealer()
          } else if (this.type === 'edit') {
            this.editDealer()
          }
        }
      },
      getDealer (id) {
        var params = {
          filter: ['id', 'name', 'email', 'phone', 'address', 'status', 'dealer_code', 'upper_dealer_code', 'region', 'contacter', 'sale_goal', 'saled_amount', 'create_time'],
          query: {
            id: {$in: [id]}
          }
        }
        api.dealer.list(params).then((res) => {
          // console.log(res.data)
          if (res.status === 200 && res.data.list.length > 0) {
            // console.log(res)
            let dealerRaw = res.data.list[0]
            this.dealer.username = dealerRaw.email
            this.dealer.name = dealerRaw.name
            this.dealer.linkman = dealerRaw.contacter
            this.dealer.phone = dealerRaw.phone
            this.dealer.password = dealerRaw.password
            this.dealer.address = dealerRaw.address
            this.dealer.area = dealerRaw.region
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      addDealer () {
        var params = {
          email: this.dealer.username,
          name: this.dealer.name,
          contacter: this.dealer.linkman,
          phone: this.dealer.phone,
          password: this.dealer.password,
          address: this.dealer.address,
          region: this.dealer.area,
          upper_dealer_code: ''
        }
        api.dealer.create(params).then((res) => {
          if (res.status === 200) {
            // 添加成功
            this.$route.router.go(this.breadcrumbNav[0].link)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      editDealer () {
        var params = {
          email: this.dealer.username,
          name: this.dealer.name,
          contacter: this.dealer.linkman,
          phone: this.dealer.phone,
          password: this.dealer.password,
          address: this.dealer.address,
          region: this.dealer.area,
          upper_dealer_code: ''
        }
        api.dealer.update(this.$route.params.id, params).then((res) => {
          if (res.status === 200) {
            // 修改成功
            this.$route.router.go(this.breadcrumbNav[0].link)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.dealer-label
  line-height 32px
.dealer-add-sumit
  margin-right 60px

</style>
