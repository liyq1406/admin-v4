<template>
  <div class="main">
    <div class="main-title">
      <h2>经销商管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel no-split-line">
      <div class="panel-hd bordered mt20">
        <h2>修改账户信息</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">账号:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.code')" class="input-text-wrap">
                  <input type="text" name="username" minlength="2" maxlength="32" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">登录密码:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.password')" class="input-text-wrap">
                  <input type="text" name="password" minlength="6" maxlength="16" class="input-text"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel no-split-line">
      <div class="panel-hd bordered mt20">
        <h2>修改经销商信息</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">经销商名称:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                  <input type="text" name="username" minlength="2" maxlength="32" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">联系人:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.contact')" class="input-text-wrap">
                  <input type="text" name="password" minlength="6" maxlength="16" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">手机号:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.phone')" class="input-text-wrap">
                  <input type="text" name="password" minlength="6" maxlength="16" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">联系地址:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.address')" class="input-text-wrap">
                  <input type="text" name="password" minlength="6" maxlength="16" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">负责区域:</label>
              <div class="controls col-16">
                <!-- <div v-placeholder="$t('ui.dealer.placeholders.name')" class="input-text-wrap">
                  <input v-model="addModal.model.belong_to" type="text" name="belong_to" required minlength="2" maxlength="32" lazy class="input-text"/>
                </div> -->
                <v-select width="100px" :label="belongType.label">
                  <select v-model="">
                    <option v-for="option in belongs" :value="option.value">{{ option.label }}</option>
                  </select>
                </v-select>
              </div>
            </div>
            <div class="form-row row mt20">
              <label class="form-control col-5 ml20 dealer-label">从属于:</label>
              <div class="controls col-16">
                <div v-placeholder="$t('ui.dealer.placeholders.area')" class="input-text-wrap">
                  <input type="text" name="password" minlength="6" maxlength="16" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions mt20">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary fr dealer-add-sumit">提交</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          label: '修改经销商'
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
      // this.getDealer()
      // this.getSales()
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
.dealer-label
  line-height 32px
.dealer-add-sumit
  margin-right 60px

</style>
