<template>
  <div class="main">
    <div class="main-title">
      <h2>销售记录管理</h2>
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
              <div class="form col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">账号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.code')" class="input-text-wrap">
                      <input v-model="dealer.username" type="email" name="dealer.username" minlength="2" maxlength="32" v-validate:username="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.username.touched && $autoValidation.username.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">登录密码:</label>
                  <div class="controls col-19" v-if="type === 'add'">
                    <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
                      <input v-model="dealer.password" type="text" name="dealer.password" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                    </div>
                  </div>
                  <div class="controls col-19" v-else>
                    <button class="btn btn-ghost" @click.prevent.stop="editPassword = !editPassword">修改密码</button>
                    <div v-if="editPassword" v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap mt10">
                      <input v-model="dealer.password" type="text" name="dealer.password" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
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
              <div class="form col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">经销商名称:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input type="text" v-model="dealer.name" name="dealer.name" minlength="2" maxlength="32" v-validate:name="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.name.touched && $autoValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">联系人:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.contact')" class="input-text-wrap">
                      <input type="text" v-model="dealer.linkman" name="dealer.linkman" minlength="6" maxlength="16" v-validate:linkman="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.linkman.touched && $autoValidation.linkman.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">手机号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.phone')" class="input-text-wrap">
                      <input type="text" v-model="dealer.phone" name="dealer.phone" minlength="6" maxlength="16" v-validate:phone="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">联系地址:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.address')" class="input-text-wrap">
                      <input type="text" v-model="dealer.address" name="dealer.address" minlength="6" maxlength="16" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.address.touched && $autoValidation.address.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.address')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">负责区域:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('ui.dealer.placeholders.area')" class="input-text-wrap">
                      <input type="text" v-model="dealer.area" name="dealer.area" minlength="6" maxlength="16" v-validate:dutyarea="{required: true}" lazy  class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.dutyarea.touched && $autoValidation.dutyarea.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">从属于:</label>
                  <div class="controls col-19">
                    <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input v-model="addModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
                    </div> -->
                    <x-select width="100px" :label="belongType.label">
                      <select v-model="belongType">
                        <option v-for="option in belongs" :value="option">{{ option.label }}</option>
                      </select>
                    </x-select>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">销售指标:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入销售指标'" class="input-text-wrap">
                      <input type="text" v-model="dealer.sale_goal" name="dealer.sale_goal" maxlength="16" v-validate:sale_goal="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.sale_goal.touched && $autoValidation.sale_goal.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span>
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
      'x-select': Select,
      Breadcrumb
    },

    data () {
      return {
        editPassword: false,
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
          belongTo: '',
          sale_goal: ''
        },
        belongs: [],
        belongType: {
          label: '无'
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
          return '添加销售记录'
        } else if (this.type === 'edit') {
          return '编辑销售记录'
        }
      },
      dealerTitle () {
        if (this.type === 'add') {
          return '添加销售记录'
        } else if (this.type === 'edit') {
          return '编辑销售记录'
        }
      }
    },

    route: {
      data () {
        if (this.$route.params.id) {
          this.type = 'edit'
          this.breadcrumbNav[1].label = '编辑销售记录'
          this.getDealer(this.$route.params.id)
        } else {
          this.breadcrumbNav[1].label = '添加销售记录'
          this.type = 'add'
        }
        this.getDealerList()
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
          if (res.status === 200 && res.data.list.length > 0) {
            let dealerRaw = res.data.list[0]
            this.dealer.username = dealerRaw.email
            this.dealer.name = dealerRaw.name
            this.dealer.linkman = dealerRaw.contacter
            this.dealer.phone = dealerRaw.phone
            this.dealer.password = dealerRaw.password
            this.dealer.address = dealerRaw.address
            this.dealer.area = dealerRaw.region
            this.dealer.sale_goal = dealerRaw.sale_goal
            if (dealerRaw.upper_dealer_code && dealerRaw.upper_dealer_code !== '') {
              api.dealer.get(dealerRaw.upper_dealer_code).then((res) => {
                if (res.status === 200) {
                  console.log(res.data)
                }
              }).catch((res) => {
                this.handleError(res)
              })
            }
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      getDealerList () {
        var temp = [{
          label: '无'
        }]
        var params = {
          filter: ['id', 'name', 'email', 'phone', 'address', 'status', 'dealer_code', 'upper_dealer_code', 'region', 'contacter', 'sale_goal', 'saled_amount', 'create_time']
        }
        api.dealer.list(params).then((res) => {
          if (res.status === 200 && res.data.list.length > 0) {
            res.data.list.forEach((item) => {
              temp.push({
                label: item.name,
                code: item.dealer_code
              })
            })
            this.belongs = temp
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
          sale_goal: this.dealer.sale_goal
        }
        if (this.belongType.code) {
          params.upper_dealer_code = this.belongType.code
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
          sale_goal: this.dealer.sale_goal
        }
        console.log(this.belongType.code)
        if (this.belongType.code) {
          console.log(this.belongType.code)
          params.upper_dealer_code = this.belongType.code
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
  padding-left 20px
  box-sizing border-box
.max-width
  max-width 700px
</style>
