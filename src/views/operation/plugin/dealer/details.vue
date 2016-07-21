<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <div class="trigger" @click.prevent="editDealer(dealer)"><i class="fa fa-pencil"></i><span class="trigger-text">编辑经销商信息</span></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <ul class="info-details">
              <li class="row">
                <div class="col-5 label">账号:</div>
                <div class="clo-19 info">{{ dealer.username }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">登录密码:</div>
                <div class="clo-19 info">{{ dealer.password }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">经销商名称:</div>
                <div class="clo-19 info">{{ dealer.name }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">联系人:</div>
                <div class="clo-19 info">{{ dealer.linkman }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">手机号:</div>
                <div class="clo-19 info">{{ dealer.phone }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">负责区域:</div>
                <div class="clo-19 info">{{ dealer.area }}</div>
              </li>
              <li class="row">
                <div class="col-5 label">从属于:</div>
                <div class="clo-19 info">{{ dealer.belong_to }}</div>
              </li>
            </ul>
          </div>
          <div class="col-10">
            <div class="row status">
              <div class="col-12">
                <div class="status-item">
                  <em>{{ dealer.sale_target || 0 }}</em>
                  <span>年销售目标</span>
                </div>
              </div>
              <div class="col-12">
                <div class="status-item">
                  <em>{{ dealer.sale_count || 0 }}</em>
                  <span>已销售数量</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getSales" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getSales">
                  <v-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="getSales" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>销售信息</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>销售时间</th>
                <th>产品型号</th>
                <th>序列号</th>
                <th>客户名称</th>
                <th>手机号</th>
                <!-- <th class="tac">{{ $t("common.action") }}</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-if="sales.length > 0">
                <tr v-for="sale in sales">
                  <!-- <td>{{* dealer.name }}</td> -->
                  <td><a v-link="'/plugins/dealer/' +$route.params.app_id + '/list/' + $route.params.dealer_id + '/sales/' + sale._id" class="hl-red">{{* sale.create_time | uniformDate }}</a></td>
                  <td>{{* sale.version }}</td>
                  <td>{{* sale.code }}</td>
                  <td>{{* sale.name }}</td>
                  <td>{{* sale.phone }}</td>
                  <!-- <td class="tac">
                    <button @click="editRule(rule)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td> -->
                </tr>
              </template>
              <tr v-if="sales.length === 0 && !loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页-->
        <pager v-if="sales.length > countPerPage" :total="sales.length" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getSales"></pager>
      </div>
    </div>
    <!--修改经销商信息浮层-->
   <modal :show.sync="editModal.show" width="600px">
     <h3 slot="header">修改经销商信息</h3>
     <div slot="body" class="form">
       <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
         <div class="form-row row">
           <label class="form-control col-5">账号:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.code')" class="input-text-wrap">
               <input v-model="editModal.model.username" type="text" v-form-ctrl name="username" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.username.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.username.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
             <div v-if="editValidation.username.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.username.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
               <!-- <span v-if="editValidation.username.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.username'), 2]) }}</span><span v-if="editValidation.username.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span> -->
             </div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">登录密码:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
               <input v-model="editModal.model.password" type="text" v-form-ctrl name="password" required minlength="6" maxlength="16" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.password.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span></div>
             <div v-if="editValidation.password.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span><span v-if="editValidation.password.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.password'), 2]) }}</span><span v-if="editValidation.username.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.password'), 32]) }}</span></div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">经销商名称:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
               <input v-model="editModal.model.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span></div>
             <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span></div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">联系人:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.contact')" class="input-text-wrap">
               <input v-model="editModal.model.linkman" type="text" v-form-ctrl name="linkman" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.linkman.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.linkman.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span></div>
             <div v-if="editValidation.linkman.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.linkman.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span></div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">手机号:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.phone')" class="input-text-wrap">
               <input v-model="editModal.model.phone" type="text" v-form-ctrl name="phone" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span></div>
             <div v-if="editValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span><span v-if="editValidation.phone.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.dealer.fields.phone'), 2]) }}</span><span v-if="editValidation.phone.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.phone'), 32]) }}</span></div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">负责区域:</label>
           <div class="controls col-19">
             <div v-placeholder="$t('ui.dealer.placeholders.area')" class="input-text-wrap">
               <input v-model="editModal.model.area" type="text" v-form-ctrl name="area" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div>
             <div v-if="editValidation.$submitted && editValidation.area.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span></div>
             <div v-if="editValidation.area.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span></div>
           </div>
         </div>
         <div class="form-row row">
           <label class="form-control col-5">从属于:</label>
           <div class="controls col-19">
             <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
               <input v-model="editModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
             </div> -->
             <v-select width="100px" :label="belongType.label">
               <select v-model="editModal.model.belong_to">
                 <option v-for="option in belongs" :value="option.value">{{ option.label }}</option>
               </select>
             </v-select>
           </div>
         </div>
         <div class="form-actions">
           <label class="del-check">
             <input type="checkbox" name="del" v-model="delChecked"/>删除此经销商
           </label>
           <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
           <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
         </div>
       </form>
     </div>
   </modal>
   <!-- 结束修改经销商信息浮层-->
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
  import Breadcrumb from 'components/Breadcrumb'
  import SearchBox from 'components/SearchBox'
  import Select from 'components/Select'
  import Modal from 'components/Modal'
  import IntelligentTable from 'components/IntelligentTable'
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import Alert from 'components/Alert'

  export default {
    name: 'TableDetails',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-alert': Alert,
      Modal,
      RadioGroup,
      LineChart,
      SearchBox,
      'v-select': Select,
      Pager,
      IntelligentTable,
      Breadcrumb
    },

    data () {
      return {
        dealer: {
          // _id: '123',
          // username: '12345',
          // password: '1115465',
          // name: '广州分部',
          // linkman: '小明',
          // phone: '13800138000',
          // area: '广州总部',
          // belong_to: '海珠'
        },
        sales: [{
          _id: 2222,
          create_time: '2016-5-31 16:18',
          version: '3.0',
          code: '123456789',
          name: '张小明',
          phone: '13800138000'
        }],
        query: '',
        loadingData: false,
        editModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {}
        },
        delChecked: false,
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
        belongs: [
          { label: '广州分部', value: '广州分部' }
        ],
        belongType: {
          label: '广州分部',
          value: '广州分部'
        },
        countPerPage: 10,
        currentPage: 1,
        editing: false,
        breadcrumbNav: [{
          label: '全部',
          link: `/operation/plugins/dealer/${this.$route.params.app_id}/list`
        }, {
          label: '经销商详情'
        }]
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          // filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          // order: this.sortOrders,
          query: {
            'distributer_id': this.$route.params.dealer_id
          }
        }
        // if (this.query.length > 0) {
        //   condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
        // }
        if (this.key !== '') {
          condition.query[this.queryType.value] = {$regex: this.query, $options: 'i'}
        }
        return condition
      }
    },

    route: {
      data () {
      }
    },

    ready () {
      this.getDealer()
      this.getSales()
    },
    methods: {
      // 获取经销商信息
      getDealer () {
        // var foo = [{a: 1}, {a: 2}, {a: 1}]
        // console.log(_.uniq(_.map(foo, 'a')))
        var self = this
        var argvs = arguments
        var fn = self.getDealer
        var params = {
          offset: 0,
          limit: 10,
          query: {
            '_id': this.$route.params.dealer_id
          }
        }
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
          console.log(token)
          api.dealer.getDealer(this.$route.params.app_id, params, token).then((res) => {
            // console.log(res)
            this.dealer = res.data.list[0]
            // this.total = res.data.count
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'dealer'
            }
            self.handlePluginError(err, env)
            // this.handleError(res)
            this.loadingData = false
          })
        })
      },
      // 获取经销商对应销售信息列表
      getSales () {
        var self = this
        var argvs = arguments
        var fn = self.getDealer
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
          console.log(token)
          api.dealer.getSales(this.$route.params.app_id, this.queryCondition, token).then((res) => {
            // console.log(res)
            this.sales = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'dealer'
            }
            self.handlePluginError(err, env)
            // this.handleError(res)
            this.loadingData = false
          })
        })
      },
      // 初始化编辑表单
      editDealer (dealer) {
        this.editModal.show = true
        this.editModal.model = this.dealer
        this.editModal.model = _.clone(dealer)
        this.originEditModel = _.clone(dealer)
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
          this.getSales()
        }
      },
      // 提交编辑表单
      onEditSubmit () {
        var self = this
        var argvs = arguments
        var fn = self.getDealer
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
            api.dealer.delDealer(this.$route.params.app_id, this.dealer._id, token).then((res) => {
              this.$route.router.go({path: '/plugins/dealer/' + this.$route.params.app_id + '/list'})
              // this.resetEdit()
              // this.getSales()
              this.editing = false
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
          // api.dealer.delDealer(this.$route.params.app_id, this.dealer._id).then((res) => {
          //   if (res.status === 200) {
          //     this.resetEdit()
          //     this.getSales()
          //   }
          // }).catch((res) => {
          //   this.handleError(res)
          //   this.editing = false
          // })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
            console.log(token)
            api.dealer.updateDealer(this.$route.params.app_id, this.dealer._id, this.editModal.model, token).then((res) => {
              this.resetEdit()
              this.getDealer()
              this.getSales()
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
          // api.dealer.updateDealer(this.$route.params.app_id, this.dealer._id, this.editModal.model).then((res) => {
          //   if (res.status === 200) {
          //     this.resetEdit()
          //     this.getSales()
          //   }
          // }).catch((res) => {
          //   this.handleError(res)
          //   this.editing = false
          // })
        }
      },
      // 编辑表单钩子
      editFormHook (form) {
        this.editModal.form = form
      },
      // 取消编辑
      onEditCancel () {
        this.resetEdit()
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

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
