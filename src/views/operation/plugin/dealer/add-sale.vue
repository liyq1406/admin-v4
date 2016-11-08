<template>
  <div class="main">
    <div class="main-title">
      <h2>销售记录管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="autoValidation">
      <form autocomplete="off" novalidate @submit.prevent="onSubmit">
        <div class="panel">
          <div class="panel-hd bordered mt20">
            <h2>{{accountTitle}}</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="form col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">客户名称:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入客户名称'" class="input-text-wrap">
                      <input v-model="saled.name" type="text" name="saled.name" minlength="2" maxlength="32" v-validate:name="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.name.touched && $autoValidation.name.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">客户类型:</label>
                  <div class="controls col-19">
                    <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                      <input v-model="addModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
                    </div> -->
                    <x-select :label="belongType.label">
                      <select v-model="belongType">
                        <option v-for="option in belongs" :value="option">{{ option.label }}</option>
                      </select>
                    </x-select>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">客户类型:</label>
                  <div class="controls col-19">
                    <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">详细地址:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入详细地址'" class="input-text-wrap">
                      <input v-model="saled.address" type="text" name="saled.address" minlength="2" maxlength="32" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.address.touched && $autoValidation.address.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">手机号:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入手机号码'" class="input-text-wrap">
                      <input v-model="saled.phone" type="text" name="saled.phone" minlength="2" maxlength="32" v-validate:phone="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">销售日期:</label>
                  <!-- <div class="controls col-19">
                    <div class="input-text-wrap">
                      <input v-model="saled.sale_time" type="date" name="saled.sale_time" minlength="2" maxlength="32" v-validate:sale_time="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                    </div>
                  </div> -->
                  <date-time-single-picker :show-time='false' :time="nowDate" @timechange = ""></date-time-single-picker>
                </div>
                  <!-- </form>
                </validator> -->
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-hd bordered mt20">
            <h2>详细信息</h2>
          </div>
          <div class="panel-bd">
            <div class="row">
              <div class="form col-14 max-width">
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">所在层数:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入所在层数'" class="input-text-wrap">
                      <input type="text" v-model="dealer.name" name="dealer.name" minlength="2" maxlength="32" v-validate:name="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.name.touched && $autoValidation.name.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">每层面积(m³):</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入每层面积'" class="input-text-wrap">
                      <input type="text" v-model="dealer.linkman" name="dealer.linkman" minlength="6" maxlength="16" v-validate:linkman="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.linkman.touched && $autoValidation.linkman.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">场所总面积(m³):</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入总面积'" class="input-text-wrap">
                      <input type="text" v-model="dealer.phone" name="dealer.phone" minlength="6" maxlength="16" v-validate:phone="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">机器放置层数:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'如2层'" class="input-text-wrap">
                      <input type="text" v-model="dealer.address" name="dealer.address" minlength="6" maxlength="16" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.address.touched && $autoValidation.address.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.address')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">常驻人数:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'如老人2，小孩1'" class="input-text-wrap">
                      <input type="text" v-model="dealer.area" name="dealer.area" minlength="6" maxlength="16" v-validate:dutyarea="{required: true}" lazy  class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.dutyarea.touched && $autoValidation.dutyarea.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">有无新风:</label>
                  <div class="controls col-19" style="height:32px;line-height:32px">
                    <input type="radio" v-model="dealer.area" name="dealer.area" class="input-text"/>
                    <label for="dealer.area" style="margin-right:20px">有</label>
                    <input type="radio" v-model="dealer.area" name="dealer.area" class="input-text"/>
                    <label for="dealer.area">无</label>
                  </div>
                </div>
                <div class="form-row row mt20">
                  <label class="form-control col-5 dealer-label">自定义备注:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入备注'" class="input-text-wrap">
                      <input type="text" v-model="dealer.sale_goal" name="dealer.sale_goal" maxlength="16" v-validate:sale_goal="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.sale_goal.touched && $autoValidation.sale_goal.required">{{ $t('common.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-actions mt20">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary">提交</button>
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
  import Breadcrumb from 'components/Breadcrumb'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import AreaSelect from 'components/AreaSelect'
  import DateTimeSinglePicker from 'components/DateTimeSinglePicker'

  export default {
    name: 'TableDetails',

    mixins: [globalMixins],

    components: {
      Breadcrumb,
      DateTimeSinglePicker,
      'x-select': Select,
      'area-select': AreaSelect
    },

    data () {
      return {
        curProvince: {},
        curCity: {},
        curDistrict: {},
        nowDate: new Date('2016-08-20T09:39:30.612Z'),
        editPassword: false,
        sending: false,
        type: '',
        saled: {
          name: '',
          address: '',
          phone: ''
        },
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
        belongs: [{
          label: '客户一',
          value: 0
        },
        {
          label: '客户二',
          value: 1
        }],
        belongType: {
          label: '客户一',
          value: 0
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
        if (this.$route.params.sale_id) {
          this.type = 'edit'
          this.breadcrumbNav[1].label = '编辑销售记录'
          // this.getSaled(this.$route.params.id)
        } else {
          this.breadcrumbNav[1].label = '添加销售记录'
          this.type = 'add'
        }
        // this.getDealerList()
      }
    },

    ready () {
    },
    methods: {
      getWarrantyList () {
        console.log('搜索')
      },
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
