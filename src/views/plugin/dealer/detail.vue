<template>
  <section class="main-wrap">
    <div class="mainwith-loading">
      <div class="breadcrumb"><a v-link="{path: '/plugins/dealer/' + $route.params.app_id + '/list/' + $route.params.dealer_id}"><i class="fa fa-arrow-circle-left"></i>经销商信息</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-hd">
              <h2>销售详细信息<a href="#" @click.prevent="editSale(sale)" class="fa fa-edit"></a></h2>
            </div>
            <div class="panel-bd">
              <div class="row">
                <div class="col-12">
                  <ul class="info-details">
                    <li class="row">
                      <div class="col-6 label">客户名称:</div>
                      <div class="clo-18 info">{{ sale.name }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">手机号码:</div>
                      <div class="clo-18 info">{{ sale.phone }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">客户类型:</div>
                      <div class="clo-18 info">{{ sale.user_type }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">省份:</div>
                      <div class="clo-18 info">{{ sale.province }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">城市:</div>
                      <div class="clo-18 info">{{ sale.city }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">区域:</div>
                      <div class="clo-18 info">{{ sale.district }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">详细地址:</div>
                      <div class="clo-18 info">{{ sale.address }}</div>
                    </li>
                  </ul>
                </div>
                <div class="col-12">
                  <ul class="info-details">
                    <li class="row">
                      <div class="col-6 label">销售日期:</div>
                      <div class="clo-18 info">{{ sale.create_time }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">场所层数:</div>
                      <div class="clo-18 info">{{ sale.place_floor_count }}㎡</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">每层面积:</div>
                      <div class="clo-18 info">{{ sale.floor_area }}㎡</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">场所总面积:</div>
                      <div class="clo-18 info">{{ sale.place_area }}㎡</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">机器放置层数:</div>
                      <div class="clo-18 info">{{ sale.lay_floor_count }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">常驻人数:</div>
                      <div class="clo-18 info">{{ sale.permanent_population }}</div>
                    </li>
                    <li class="row">
                      <div class="col-6 label">有无新风:</div>
                      <div class="clo-18 info"><span v-if="sale.machine_isexists === 0">无</span><span v-else>有</span></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="panel-hd">
              <h2>销售照片</h2>
            </div>
            <div class="panel-bd">
            </div>
          </div>
        </div>
      </div>
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
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">手机号码:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.phone" type="text" v-form-ctrl name="phone" number required minlength="2" maxlength="11" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.phone.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.phone.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
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
              <div v-if="editValidation.$submitted && editValidation.address.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.address.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.address.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.address.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">场所层数:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.place_floor_count" type="text" v-form-ctrl name="place_floor_count" number required  lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.place_floor_count.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.place_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.place_floor_count.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.place_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.place_floor_count.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.place_floor_count.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">每层面积:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.floor_area" type="text" v-form-ctrl name="floor_area" number required  lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.floor_area.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.floor_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.floor_area.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.floor_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.floor_area.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.floor_area.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">场所总面积:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.place_area" type="text" v-form-ctrl name="place_area" number required  lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.place_area.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.place_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.place_area.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.place_area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.place_area.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.place_area.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">机器放置层数:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.lay_floor_count" type="text" v-form-ctrl name="lay_floor_count" number required  lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.lay_floor_count.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.lay_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.lay_floor_count.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.lay_floor_count.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.lay_floor_count.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.lay_floor_count.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">常驻人数:</label>
            <div class="controls col-19">
              <div class="input-text-wrap">
                <input v-model="editModal.model.permanent_population" type="text" v-form-ctrl name="permanent_population" number required  lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.permanent_population.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.permanent_population.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="editValidation.permanent_population.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.permanent_population.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="editValidation.permanent_population.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.permanent_population.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
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
  </section>
</template>

<script>
  // import Vue from 'vue'
  // import locales from '../../../consts/locales/index'
  import api from '../../../api'
  import _ from 'lodash'
  import RadioGroup from '../../../components/RadioGroup'
  // import dateFormat from 'date-format'
  import LineChart from '../../../components/charts/Line'
  import Pager from '../../../components/Pager'
  import SearchBox from '../../../components/SearchBox'
  import Select from '../../../components/Select'
  import Modal from '../../../components/Modal'
  import AreaSelect from '../../../components/AreaSelect'
  import IntelligentTable from '../../../components/IntelligentTable'
  import { globalMixins } from '../../../mixins'
  import Alert from '../../../components/Alert'

  export default {
    name: 'TableDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-alert': Alert,
      'modal': Modal,
      'radio-group': RadioGroup,
      'area-select': AreaSelect,
      'line-chart': LineChart,
      'search-box': SearchBox,
      'v-select': Select,
      'pager': Pager,
      'intelligent-table': IntelligentTable
    },

    data () {
      return {
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
        selectedDistrict: {}
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
        var params = {
          offset: 0,
          limit: 10,
          query: {
            '_id': this.$route.params.sale_id
          }
        }
        api.dealer.getSales(this.$route.params.app_id, params).then((res) => {
          if (res.status === 200) {
            this.sale = res.list[0]
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
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
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          api.dealer.delSales(this.$route.params.app_id, this.sale._id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getSale()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          api.dealer.updateSales(this.$route.params.app_id, this.sale._id, this.editModal.model).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getSale()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
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
      },
      // 搜索
      handleSearch () {
        if (this.query.length === 0) {

        }
      }
    }
  }
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'
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

</style>
