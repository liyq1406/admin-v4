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
              <button class="btn btn-primary" :disabled="tips" :class="{'disabled': tips}"><i class="fa fa-plus"></i>添加经销商</button>
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
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="key" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getDealer(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDealer(true)">
                  <x-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click.prevent="getDealer(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>经销商列表</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>经销商名称</th>
                <th>帐号(经销商代码)</th>
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
              <template v-if="total > 0">
                <tr v-for="dealer in dealers">
                  <!-- <td>{{* dealer.name }}</td> -->
                  <td><a v-link="'/operation/plugins/dealer/' +$route.params.app_id + '/list/' + dealer.id" class="hl-red">{{* dealer.name }}</a></td>
                  <td>{{* dealer.email || '--'}}</td>
                  <td>{{* dealer.contacter || '--'}}</td>
                  <td>{{* dealer.phone || '--'}}</td>
                  <td>{{* dealer.region || '--'}}</td>
                  <td>{{* dealer.belongTo || '--' }}</td>
                  <td>{{* dealer.sale_goal || '--'}}</td>
                  <td>{{* dealer.saled_amount || '--' }}</td>
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
        <pager :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getDealer"></pager>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import api from 'api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import Pager from 'components/Pager'
  import DatePicker from 'components/DatePicker'
  import Modal from 'components/Modal'

  export default {
    name: 'DealerList',

    mixins: [globalMixins, pluginMixins],

    components: {
      'x-select': Select,
      SearchBox,
      Pager,
      Modal,
      DatePicker
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
          { label: '帐号', value: 'email' },
          { label: '联系人', value: 'contacter' }
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
        key: '',
        adding: false,
        exporting: false
      }
    },

    computed: {
      // 基本筛选条件
      baseCondition () {
        let condition = {
          filter: ['id', 'name', 'email', 'phone', 'address', 'status', 'dealer_code', 'upper_dealer_code', 'region', 'contacter', 'sale_goal', 'saled_amount', 'create_time'],
          query: {},
          order: {
            create_time: 'desc'
          }
        }

        if (this.key.length > 0) {
          condition.query[this.queryType.value] = {$in: [this.key]}
        }

        return condition
      },

      // 列表查询条件
      queryCondition () {
        let condition = _.cloneDeep(this.baseCondition)

        condition.limit = this.countPerPage
        condition.offset = (this.currentPage - 1) * this.countPerPage

        return condition
      }
    },

    ready () {
      this.getDealer()
    },

    methods: {
      /**
       * 处理导出 CSV 按钮点击
       */
      onExportBtnClick () {
        if (this.exporting) {
          return
        }

        let postData = {
          name: '经销商列表',
          describe: '经销商列表',
          type: 5,
          params: this.baseCondition
        }

        this.exporting = true
        api.exportTask.createTask(postData).then((res) => {
          this.showNotice({
            type: 'success',
            content: '导出CSV任务创建成功'
          })
          this.$route.router.go('/operation/settings/offline-data')
          // this.onExportCancel()
        }).catch((res) => {
          this.exporting = false
          this.handleError(res)
        })
      },

      // 获取经销商列表
      getDealer (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.dealer.list(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.dealers = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },
      // 搜索
      handleSearch () {
        if (this.key.length === 0) {
          this.getDealer(true)
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
    .x-select
      display inline-block
</style>
