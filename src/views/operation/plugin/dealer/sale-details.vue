<template>
  <div class="main">
    <div class="main-title">
      <h2>销售详细信息</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <div class="sale-details-head">{{sale.name}}<i class="fa fa-edit"></i></div>
          <div v-stretch="192">
            <info-list :info="userInfo"></info-list>
          </div>
        </div>
        <div class="col-8">
          <div class="sale-info-head">销售信息
            <div class="sale-info-body">
              <div class="row">
                <div class="col-9">销售日期:</div>
                <div class="col-15">{{sale.sale_time | uniformDate}}</div>
              </div>
              <div class="row">
                <div class="col-9">场所层数:</div>
                <div class="col-15">10</div>
              </div>
              <div class="row">
                <div class="col-9">每层面积:</div>
                <div class="col-15">110m</div>
              </div>
              <div class="row">
                <div class="col-9">场所总面积:</div>
                <div class="col-15">880m</div>
              </div>
              <div class="row">
                <div class="col-9">机器放置层数:</div>
                <div class="col-15">2</div>
              </div>
              <div class="row">
                <div class="col-9">常驻人数:</div>
                <div class="col-15">12</div>
              </div>
              <div class="row">
                <div class="col-9">有无新风:</div>
                <div class="col-15">有</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>销售图片</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div v-if="sale.pictures.length > 0" v-for="pic in sale.pictures" class="col-5 sale-img mr20">
            <img :src="pic.url" alt="">
          </div>
          <div v-else class="nopic">
            暂时无图片
          </div>
        </div>
      </div>
    </div>
      <!-- <div class="panel-hd">
        <h2>销售照片</h2>
        <div class="panel-bd">
          <x-alert :cols="7">
            <p>暂时无照片</p>
          </x-alert>
        </div>
      </div> -->
    <!--修改销售信息浮层-->
   <modal :show.sync="editModal.show" width="600px">
     <h3 slot="header">修改销售信息</h3>
     <div slot="body" class="form">
      <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
        <div class="form-row row">
          <label class="form-control col-5">客户名称:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.name')}) }}</span></div>
            <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.name')}) }}</span><span v-if="editValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.sale.name'), 2]) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.sale.name'), 32]) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">手机号码:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.phone" type="text" v-form-ctrl name="phone" number required minlength="2" maxlength="11" lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.phone')}) }}</span></div>
            <div v-if="editValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.phone')}) }}</span><span v-if="editValidation.phone.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.sale.phone'), 2]) }}</span><span v-if="editValidation.phone.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.sale.phone'), 32]) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">客户类型:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.user_type" type="text" v-form-ctrl name="user_type" number required minlength="2" maxlength="11" lazy class="input-text"/>
            </div>
          </div>
        </div>
        <!-- <div class="form-row row">
          <label class="form-control col-5">所在地区:</label>
          <div class="controls col-19">
            <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict"></area-select>
          </div>
        </div> -->
        <div class="form-row row">
          <label class="form-control col-5">详细地址:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.address" type="text" v-form-ctrl name="address" required minlength="2" maxlength="11" lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.address.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.address')}) }}</span></div>
            <div v-if="editValidation.address.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.address')}) }}</span>
              <!-- <span v-if="editValidation.address.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.sale.address'), 2]) }}</span>
              <span v-if="editValidation.address.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.sale.address'), 32]) }}</span> -->
            </div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">场所层数:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.place_floor_num" type="text" v-form-ctrl name="place_floor_count" number required  lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.place_floor_count.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.place_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.floor_num')}) }}</span></div>
            <div v-if="editValidation.place_floor_count.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.place_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.floor_num')}) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">每层面积:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.floor_area" type="text" v-form-ctrl name="floor_area" number required  lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.floor_area.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.floor_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.floor_area')}) }}</span></div>
            <div v-if="editValidation.floor_area.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.floor_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.floor_area')}) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">场所总面积:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.place_area" type="text" v-form-ctrl name="place_area" number required  lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.place_area.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.place_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.place_area')}) }}</span></div>
            <div v-if="editValidation.place_area.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.place_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.place_area')}) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">机器放置层数:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.lay_floor" type="text" v-form-ctrl name="lay_floor_count" number required  lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.lay_floor_count.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.lay_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.lay_floor')}) }}</span></div>
            <div v-if="editValidation.lay_floor_count.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.lay_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.lay_floor')}) }}</span></div>
          </div>
        </div>
        <div class="form-row row">
          <label class="form-control col-5">常驻人数:</label>
          <div class="controls col-19">
            <div class="input-text-wrap">
              <input v-model="editModal.model.permanent_population" type="text" v-form-ctrl name="permanent_population" number required  lazy class="input-text"/>
            </div>
            <div v-if="editValidation.$submitted && editValidation.permanent_population.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.permanent_population.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.permanent_population')}) }}</span></div>
            <div v-if="editValidation.permanent_population.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.permanent_population.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.sale.permanent_population')}) }}</span></div>
          </div>
        </div>
        <div class="form-actions">
          <label class="del-check">
            <input type="checkbox" name="del" v-model="delChecked"/>删除此销售记录
          </label>
          <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      <form>
     </div>
   </modal>
   <!-- 结束修改销售信息浮层-->
  </div>
</template>

<script>
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import api from 'api'
import _ from 'lodash'
import RadioGroup from 'components/RadioGroup'
// import dateFormat from 'date-format'
import LineChart from 'components/charts/Line'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import Select from 'components/Select'
import Modal from 'components/Modal'
import AreaSelect from 'components/AreaSelect'
import IntelligentTable from 'components/IntelligentTable'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Alert from 'components/Alert'

export default {
  name: 'TableDetails',

  mixins: [globalMixins, pluginMixins],

  components: {
    'x-alert': Alert,
    Modal,
    RadioGroup,
    AreaSelect,
    LineChart,
    SearchBox,
    'x-select': Select,
    Pager,
    IntelligentTable,
    Breadcrumb,
    InfoCard,
    InfoList
  },

  data () {
    return {
      userSummary: {
        title: '这是客户名称'
      },
      userInfo: {
        phone: {
          label: '手机',
          value: ''
        },
        type: {
          label: '客户类型',
          value: ''
        },
        province: {
          label: '省份',
          value: '未知'
        },
        city: {
          label: '城市',
          value: '未知'
        },
        area: {
          label: '所在区域',
          value: ''
        },
        address: {
          label: '详细地址',
          value: ''
        }
      },
      sale: {
        _id: 2233454,
        name: '小明',
        phone: '13800138000',
        user_type: '客户一',
        province: '广东省',
        city: '广州市',
        district: '海珠区',
        address: '聚德路龙腾18园',
        place_floor_count: 2,
        floor_area: 80,
        place_area: 150,
        lay_floor_count: 2,
        permanent_population: 3,
        machine_isexists: 0,
        proudct_id: 12345,
        product_type: '类型一',
        product_sn: '88888',
        remark: '暂无备注',
        create_time: '2016.06.03 14:56'
      },
      query: '',
      loadingData: false,
      editModal: {
        show: false,
        form: {},
        editingTag: false,
        model: {}
      },
      originEditModel: {},
      editValidation: {},
      queryTypeOptions: [
        { label: '产品型号', value: 'version' },
        { label: '客户名称', value: 'name' },
        { label: '手机号', value: 'phone' }
      ],
      queryType: {
        label: '客户名称',
        value: 'name'
      },
      delChecked: false,
      selectedProvince: {},
      selectedCity: {},
      selectedDistrict: {},
      breadcrumbNav: [{
        label: '经销商管理',
        link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
      }, {
        label: '经销商详情',
        link: `/operation/plugins/dealer/${this.$route.params.app_id}/list/${this.$route.params.dealer_id}`
      }, {
        label: '销售详情'
      }]
    }
  },

  computed: {
  },

  route: {
    data () {
    }
  },

  ready () {
    this.getSale()
  },
  methods: {
    getSale () {
      this.loadingData = true
      // var params = {
      //   offset: 0,
      //   limit: 10,
      //   query: {
      //     '_id': this.$route.params.sale_id
      //   }
      // }
      api.dealer.getUser(this.$route.params.sale_id).then((res) => {
        this.sale = res.data
        this.userInfo.phone.value = this.sale.phone
        this.userInfo.type.value = this.sale.client_type
        this.userInfo.province.value = this.sale.province
        this.userInfo.city.value = this.sale.city
        this.userInfo.address.value = this.sale.address
        // todo 字段缺失
        this.userInfo.area.value = this.sale.area
        this.loadingData = false
        this.loadingData = false
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },
    editProduct () {
      this.showEditModal = true
    },
    // 编辑表单钩子
    editFormHook (form) {
      this.editForm = form
    },
    // 初始化编辑表单
    editSale (sale) {
      this.editModal.show = true
      this.editModal.model = this.sale
      this.editModal.model = _.clone(sale)
      this.originEditModel = _.clone(sale)
    },
    // 提交编辑表单
    onEditSubmit () {
      var self = this
      var argvs = arguments
      var fn = self.getSale
      if (this.delChecked && !this.editing) { // 删除
        // this.editing = true
        // api.dealer.delSales(this.$route.params.app_id, this.sale._id).then((res) => {
        //   if (res.status === 200) {
        //     this.resetEdit()
        //     this.getSale()
        //   }
        // }).catch((res) => {
        //   this.handleError(res)
        //   this.editing = false
        // })
        this.editing = true
        this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
          api.dealer.delSales(this.$route.params.app_id, this.sale._id, token).then((res) => {
            this.$route.router.go({path: '/plugins/dealer/' + this.$route.params.app_id + '/list/' + this.$route.params.dealer_id})
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'dealer'
            }
            self.handlePluginError(err, env)
            // this.handleError(res)
            this.editing = false
          })
        })
      } else if (this.editValidation.$valid && !this.editing) { // 更新
        // this.editing = true
        // api.dealer.updateSales(this.$route.params.app_id, this.sale._id, this.editModal.model).then((res) => {
        //   if (res.status === 200) {
        //     this.resetEdit()
        //     this.getSale()
        //   }
        // }).catch((res) => {
        //   this.handleError(res)
        //   this.editing = false
        // })
        this.editing = true
        this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
          console.log(token)
          api.dealer.updateSales(this.$route.params.app_id, this.sale._id, this.editModal.model, token).then((res) => {
            this.resetEdit()
            this.getSale()
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'dealer'
            }
            self.handlePluginError(err, env)
            // this.handleError(res)
            this.editing = false
          })
        })
      }
    },
    onEditCancel () {
      this.resetEdit()
    },
    // 关闭编辑浮层并净化编辑表单
    resetEdit () {
      this.editing = false
      this.delChecked = false
      this.editModal.show = false
      this.editModal.model = this.originEditModel
    },
    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    }
    // 搜索
    // handleSearch () {
    //   if (this.query.length === 0) {
    //
    //   }
    // }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.nopic
  height 200px
  line-height 200px
  text-align center
.fa
  margin-left 5px
.status
  clearfix()
  text-align right
  margin-top 50px

  .status-item
    border-left 1px solid #E4E4E4
    box-sizing border-box
    margin-left 10px

    em
    span
      display block

    em
      font-style normal
      font-size 32px
      color red

  :first-child
    .status-item
      border none
      margin-left 0

.sale-details-head
  margin 10px 10px 15px 10px
  font-size 18px
.sale-info-head
  background-color #F2F2F2
  border 1px solid #DDDDDD
  width 80%
  font-size 15px
  margin-left auto
  margin-top 50px
  line-height 30px
  text-indent 10px
  .sale-info-body
    line-height 25px
    text-indent 0
    font-size 10px
    padding 10px
    background-color #F8F8F8
    border-top 1px solid #DDDDDD
.sale-img
  img
    width 100%
    padding 10px
    height 140px

</style>
