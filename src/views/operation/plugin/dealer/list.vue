<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group" style="display:inline-block">
            <a v-link="'/operation/plugins/dealer/' +$route.params.app_id + '/add'">
              <button class="btn btn-success" :disabled="tips" :class="{'disabled': tips}"><i class="fa fa-plus"></i>添加经销商</button>
            </a>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDealer" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDealer">
                  <v-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click.prevent="getDealer" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>经销商列表</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>经销商名称</th>
                <th>账号(经销商代码)</th>
                <th>联系人</th>
                <th>手机号</th>
                <th>负责区域</th>
                <th>从属于</th>
                <th>年销售指标</th>
                <th>已售数量</th>
                <th>状态</th>
                <!-- <th class="tac">{{ $t("common.action") }}</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-if="dealers.length > 0">
                <tr v-for="dealer in dealers">
                  <!-- <td>{{* dealer.name }}</td> -->
                  <td><a v-link="'/plugins/dealer/' +$route.params.app_id + '/list/' + dealer._id" class="hl-red">{{* dealer.name }}</a></td>
                  <td>{{* dealer.username }}</td>
                  <td>{{* dealer.linkman }}</td>
                  <td>{{* dealer.phone }}</td>
                  <td>{{* dealer.area }}</td>
                  <td>{{* dealer.belong_to || '无' }}</td>
                  <td>{{* dealer.sale_target }}</td>
                  <td>{{* dealer.sale_count || 0 }}</td>
                  <td><span v-if="dealer.status === 1" class="hl-green">启用</span><span v-else class="hl-gray">停用</span></td>
                  <!-- <td class="tac">
                    <button @click="editRule(rule)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td> -->
                </tr>
              </template>
              <tr v-if="dealers.length === 0 && !loadingData">
                <td colspan="9" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页-->
        <pager v-if="dealers.length > countPerPage" :total="dealers.length" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getDealer"></pager>
      </div>
    </div>

    <!-- Start: 添加经销商浮层 -->
    <modal :show.sync="addModal.show" width="500px" :flag="addModal.editingTag" @close="onAddCancel">
      <h3 slot="header">添加经销商信息</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-5">账号:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.code')" class="input-text-wrap">
                <input v-model="addModal.model.username" type="text" name="username" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.username.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.username.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span></div>
              <div v-if="addValidation.username.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.username.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span><span v-if="addValidation.username.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.username'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">登录密码:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
                <input v-model="addModal.model.password" type="text" name="password" v-form-ctrl required minlength="6" maxlength="16" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.password.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span></div>
              <div v-if="addValidation.password.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span><span v-if="addValidation.password.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.password'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">经销商名称:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                <input v-model="addModal.model.name" type="text" name="name" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span></div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.name')}) }}</span><span v-if="addValidation.name.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">联系人:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.contact')" class="input-text-wrap">
                <input v-model="addModal.model.linkman" type="text" name="linkman" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.linkman.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.linkman.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span></div>
              <div v-if="addValidation.linkman.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.linkman.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.linkman')}) }}</span><span v-if="addValidation.linkman.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.linkman'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">手机号:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.phone')" class="input-text-wrap">
                <input v-model="addModal.model.phone" type="text" name="phone" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span></div>
              <div v-if="addValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.phone')}) }}</span><span v-if="addValidation.phone.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.phone'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">联系地址:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.address')" class="input-text-wrap">
                <input v-model="addModal.model.address" type="text" name="address" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.address.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.address')}) }}</span></div>
              <div v-if="addValidation.address.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.address.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.address')}) }}</span><span v-if="addValidation.address.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.address'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">负责区域:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.area')" class="input-text-wrap">
                <input v-model="addModal.model.area" type="text" name="area" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.area.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span></div>
              <div v-if="addValidation.area.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.area.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.area')}) }}</span><span v-if="addValidation.area.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.area'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">从属于:</label>
            <div class="controls col-19">
              <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                <input v-model="addModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
              </div> -->
              <v-select width="100px" :label="belongType.label">
                <select v-model="addModal.model.belong_to">
                  <option v-for="option in belongs" :value="option.value">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">年销售目标:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.dealer.placeholders.target')" class="input-text-wrap">
                <input v-model="addModal.model.sale_target" type="text" name="sale_target" v-form-ctrl required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.sale_target.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.sale_target.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.sale_target')}) }}</span></div>
              <div v-if="addValidation.sale_target.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.sale_target.$error.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.sale_target')}) }}</span><span v-if="addValidation.sale_target.$error.customValidator">{{ $t('ui.validation.maxlength', [ $t('ui.dealer.fields.sale_target'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="status" v-model="addModal.model.status"/>启用
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 添加规则浮层 -->

    <!-- Start: 编辑规则浮层 -->
    <!-- <modal :show.sync="editModal.show" :width="'670px'" :flag="editModal.editingTag">
      <h3 slot="header">{{ $t("ui.rule.edit_rule") }}</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.rule.del_rule") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal> -->
    <!-- End: 编辑规则浮层 -->
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import api from 'api'
  import Select from 'components/Select'
  import DatePicker from 'components/DatePicker'
  import TimePicker from 'components/TimePicker'
  import AreaSelect from 'components/AreaSelect'
  import Editor from 'components/Editor'
  import Pager from 'components/Pager'
  import Modal from 'components/Modal'
  import SearchBox from 'components/SearchBox'
  import _ from 'lodash'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins, pluginMixins],

    components: {
      'editor': Editor,
      'v-select': Select,
      'search-box': SearchBox,
      'date-picker': DatePicker,
      'time-picker': TimePicker,
      'area-select': AreaSelect,
      'modal': Modal,
      'pager': Pager
    },

    data () {
      return {
        // dealers: [{
        //   _id: 111,
        //   username: 12345,
        //   name: '广州分部',
        //   code: '10000',
        //   linkman: '小明',
        //   phone: '13800138000',
        //   area: '华南地区',
        //   belong_to: '广州分部',
        //   sale_target: '11000',
        //   sole: '1213',
        //   status: 0
        // }],
        dealers: [],
        loadingData: false,
        addModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {
            status: true,
            belong_to: '广州分部'
          }
        },
        editModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {}
        },
        originAddModel: {},
        originEditModel: {},
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
        queryTypeOptions: [
          { label: '名称', value: 'name' },
          { label: '账号', value: 'code' },
          { label: '联系人', value: 'contact' }
        ],
        belongs: [
          { label: '广州分部', value: '广州分部' }
        ],
        belongType: {
          label: '广州分部',
          value: '广州分部'
        },
        queryType: {
          label: '名称',
          value: 'name'
        },
        total: 0,
        countPerPage: 10,
        currentPage: 1,
        query: '',
        adding: false
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          // filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          // order: this.sortOrders,
          query: {}
        }
        // if (this.query.length > 0) {
        //   // condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
        //   condition.query[this.queryType.value] = { $in: this.query }
        // }
        if (this.key !== '') {
          condition.query[this.queryType.value] = {$regex: this.query, $options: 'i'}
        }
        return condition
      }
    },
    ready () {
      this.getDealer()
    },

    methods: {
      // 获取经销商列表
      getDealer () {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        // this.loadingData = true
        // this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
        //   api.dealer.getDealer(this.$route.params.app_id, this.queryCondition, token).then((res) => {
        //     this.dealers = res.data.list
        //     this.total = res.data.count
        //     this.loadingData = false
        //   }).catch((err) => {
        //     var env = {
        //       'fn': fn,
        //       'argvs': argvs,
        //       'context': self,
        //       'plugin': 'dealer'
        //     }
        //     self.handlePluginError(err, env)
        //     // this.handleError(res)
        //     this.loadingData = false
        //   })
        // })
        // api.dealer.getDealer(this.$route.params.app_id, this.queryCondition).then((res) => {
        //   if (res.status === 200) {
        //     this.dealers = res.list
        //     this.total = res.count
        //     this.loadingData = false
        //   }
        // }).catch((res) => {
        //   this.handleError(res)
        //   this.loadingData = false
        // })
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },
      // 添加表单钩子
      addFormHook (form) {
        this.addModal.form = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editModal.form = form
      },
      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.addModal.show = false
        this.addModal.model = _.cloneDeep(this.originAddModel)
        this.$nextTick(() => {
          this.addModal.form.setPristine()
        })
      },
      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.delChecked = false
        this.editModal.show = false
        this.editModal.model = this.originEditModel
      },
      // 初始化编辑表单
      editRule (rule) {
        this.editModal.show = true
        // if (rule.type === 1) {
        //   this.editModal.value1 = rule.value
        // } else {
        //   this.editModal.value2 = rule.value
        // }
        this.editModal.model = _.clone(rule)
        this.originEditModel = _.clone(rule)
      },
      // 初始化添加表单
      addDealer (dealer) {
        this.addModal.show = true
        // this.addProduct = this.currProduct
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
      },
      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },
      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getDealer()
        }
      },
      onEditSubmit () {},
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          var self = this
          var argvs = arguments
          var fn = self.onAddSubmit
          if (typeof querying !== 'undefined') {
            this.currentPage = 1
          }
          this.getAppToKen(this.$route.params.app_id, 'dealer').then((token) => {
            // console.log(token)
            this.adding = true
            api.dealer.addDealer(this.$route.params.app_id, this.addModal.model, token).then((res) => {
              if (res.status === 200) {
                this.getDealer()
                this.resetAdd()
              }
            }).catch((res) => {
              this.handleError(res)
              this.adding = false
            }).catch((err) => {
              var env = {
                'fn': fn,
                'argvs': argvs,
                'context': self,
                'plugin': 'dealer'
              }
              self.handlePluginError(err, env)
              // this.handleError(res)
              this.adding = false
            })
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .form
    max-width 640px

  .select-group
    .v-select
      display inline-block
</style>
