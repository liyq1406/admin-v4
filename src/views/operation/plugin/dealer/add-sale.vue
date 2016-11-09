<template>
  <div class="main">
    <div class="main-title">
      <h2>销售记录管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <validator name="autoValidation">
      <form autocomplete="off" novalidate @submit.prevent="onSubmit">
        <div class="panel">
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
                      <span v-if="$autoValidation.name.touched && $autoValidation.name.required">{{ $t('common.validation.required', {field: '客户名称'}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">所在地区:</label>
                  <div class="controls col-19">
                    <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" select-size="small" @province-change="" @city-change="" @district-change=""></area-select>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">详细地址:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'请输入详细地址'" class="input-text-wrap">
                      <input v-model="saled.address" type="text" name="saled.address" minlength="2" maxlength="32" v-validate:address="{required: true}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$autoValidation.address.touched && $autoValidation.address.required">{{ $t('common.validation.required', {field: '详细地址'}) }}</span>
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
                      <span v-if="$autoValidation.phone.touched && $autoValidation.phone.required">{{ $t('common.validation.required', {field: '手机号'}) }}</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 dealer-label">销售日期:</label>
                  <date-time-single-picker :show-time='true' :time="nowDate" @timechange = "timeChange"></date-time-single-picker>
                </div>
                <div class="top-bordered">
                  <div class="form-row col-offset-1 mt20" v-if="type === 'edit'">
                    <label class="del-check">
                      <input type="checkbox" name="del" v-model="delChecked"/> 删除销售记录
                    </label>
                  </div>
                  <div class="form-actions col-offset-2">
                    <button type="submit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary w100"></button>
                  </div>
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
        nowDate: new Date(),
        submitting: false,
        type: '',
        saled: {
          name: '',
          address: '',
          phone: ''
        },
        breadcrumbNav: [{
          label: '全部',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
        }, {
          label: '经销商详情',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list/${this.$route.params.dealer_id}`
        }, {
          label: '添加经销商'
        }],
        saleTime: new Date(),
        clientType: 'common_buyer',
        delChecked: false
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
          this.breadcrumbNav[2].label = '编辑销售记录'
          this.getDealerInfo()
        } else {
          this.breadcrumbNav[2].label = '添加销售记录'
          this.type = 'add'
        }
      }
    },

    ready () {
    },
    methods: {
      onSubmit () {
        // 如果表单正在提交，禁止二次提交
        if (this.submitting) return

        // 如果勾选了删除但在确认弹窗中没确认，则取消该次表单提交动作
        if (this.delChecked && !window.confirm('确定要删除该数据端点？')) return

        // 如果表单验证不通过则重新验证
        if (!this.delChecked && this.$autoValidation.invalid) {
          this.$validate(true)
          return
        }

        // 开始提交表单
        this.submitting = true

        if (this.type === 'add') {
          this.addDealer()
        } else if (this.type === 'edit') {
          if (this.delChecked) {
            this.delDealer()
          } else {
            this.editDealer()
          }
        }
      },
      getDealerInfo () {
        var condition = {
          filter: ['name', 'id', 'email', 'phone', 'client_type', 'province', 'city', 'address', 'sn', 'sale_time', 'product_mod', 'mac', 'product_id', 'device_id'],
          limit: 1,
          offset: 0,
          query: {
            id: {$in: [this.$route.params.sale_id]}
          }
        }
        api.dealer.getSales(this.$route.params.dealer_id, condition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            let saleInfo = res.data.list[0]
            this.saled.name = saleInfo.name || ''
            this.saled.phone = saleInfo.phone || ''
            this.saled.address = saleInfo.address || ''
            this.clientType = saleInfo.client_type || 'common_buyer'
            this.curProvince.name = saleInfo.province
            this.curCity.name = saleInfo.city
            this.curDistrict.name = saleInfo.region
            if (saleInfo.sale_time) {
              let time = +new Date()
              try {
                time = +new Date(saleInfo.sale_time)
                time = time - 3600 * 1000 * 8
              } catch (e) {
                // 非法字符串
              }
              this.saleTime = this.nowDate = new Date(time)
            }
          }
        }).catch((err) => {
          this.handleError(err)
        })
      },
      addDealer () {},
      delDealer () {
        api.dealer.delClientInfo(this.$route.params.sale_id).then((res) => {
          if (res.status === 200) {
            // 删除成功
            this.$route.router.go('../')
          }
          this.submitting = false
        }).catch((res) => {
          this.submitting = false
          this.handleError(res)
        })
      },
      editDealer () {
        let params = {
          address: this.saled.address,
          name: this.saled.name,
          phone: this.saled.phone,
          sale_time: this.saleTime,
          client_type: this.clientType,
          dealer_id: this.$route.params.dealer_id,
          province: this.curProvince.name || '',
          city: this.curCity.name || '',
          region: this.curDistrict.name || ''
        }
        api.dealer.editClientInfo(this.$route.params.sale_id, params).then((res) => {
          if (res.status === 200) {
            // 修改成功
            this.$route.router.go('../')
          }
          this.submitting = false
        }).catch((res) => {
          this.submitting = false
          this.handleError(res)
        })
      },
      timeChange (time) {
        this.saleTime = new Date(+time + 8 * 3600 * 1000)
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
  max-width 600px
.top-bordered
  border-top 1px solid default-border-color
</style>
