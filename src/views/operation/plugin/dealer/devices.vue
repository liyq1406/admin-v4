<template>
  <div class="panel major-clients-config">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getSales" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getSales">
                <x-select width="100px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click="getSales" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
            <div class="filter-group-item">
              <button @click="importDevices" class="btn btn-primary">{{ text.import_devices }}</button>
            </div>
          </div>
          <h3>销售信息</h3>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>设备MAC</th>
              <th>销售时间</th>
              <th>产品型号</th>
              <th>序列号</th>
              <th>客户名称</th>
              <th>手机号</th>
              <th class="tac">{{ $t("common.action") }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="sales.length > 0">
              <tr v-for="sale in sales">
                <td v-if="sale.mac" ><a v-link="'/operation/products/' + sale.product_id + '/devices/' + sale.device_id + '/info'" class="hl-red">{{ sale.mac || '--' }}</a></td>
                <td v-if="!sale.mac"> {{ sale.mac || '--' }} </td>
                <td><a v-link="'/operation/plugins/dealer/' +$route.params.app_id + '/list/' + $route.params.dealer_id + '/sales/' + sale.id" class="hl-red">{{ sale.sale_time | formatDate 'yyyy-MM-dd' }}</a></td>
                <td>{{ sale.product_mod || '--' }}</td>
                <td>{{ sale.sn || '--' }}</td>
                <td>{{ sale.name || '--' }}</td>
                <td>{{ sale.phone || '--' }}</td>
                <td class="tac">
                  <button v-link="'/operation/plugins/dealer/' +$route.params.app_id + '/list/' + $route.params.dealer_id + '/edit/' + sale.id" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                </td>
              </tr>
            </template>
            <tr v-if="sales.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页-->
      <pagination :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getSales" @count-update="onPageCountUpdate"></pagination>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import { pluginMixins } from '../mixins'
// import formatDate from 'filters/format-date'

export default {
  name: 'devices',
  mixins: [pluginMixins],

  components: {
  },

  data () {
    return {
      text: {
        import_devices: '导入设备'
      },
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
      status: '',
      dealerInfo: {
        linkman: {
          label: '联系人',
          value: ''
        },
        phone: {
          label: '手机号',
          value: ''
        },
        id: {
          label: '帐号',
          value: ''
        },
        area: {
          label: '负责区域',
          value: ''
        },
        loc: {
          label: '地理位置',
          value: ''
        },
        belong: {
          label: '从属于',
          value: ''
        },
        target: {
          label: '年销售目标',
          value: ''
        },
        sale: {
          label: '已售数量',
          value: ''
        }
      },
      // sales: [{
      //   _id: 2222,
      //   create_time: '2016-5-31 16:18',
      //   version: '3.0',
      //   code: '123456789',
      //   name: '张小明',
      //   phone: '13800138000'
      // }],
      sales: [],
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
        { label: '产品型号', value: 'product_mod' },
        { label: '客户名称', value: 'name' },
        { label: '手机号', value: 'phone' },
        { label: '序列号', value: 'sn' }
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
      total: 0,
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
    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    queryCondition () {
      var condition = {
        filter: ['name', 'id', 'email', 'phone', 'client_type', 'province', 'city', 'address', 'sn', 'sale_time', 'product_mod', 'mac', 'product_id', 'device_id', 'product_mod'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = {$in: [this.query]}
      }
      return condition
    }
  },

  ready () {
    this.getSales()
  },

  route: {
    data () {
    }
  },

  methods: {
    // 获取经销商对应销售信息列表
    getSales () {
      if (typeof querying !== 'undefined') {
        this.currentPage = 1
      }
      this.loadingData = true
      api.dealer.getSales(this.$route.params.dealer_id, this.queryCondition).then((res) => {
        this.sales = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },
    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getSales()
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
    importDevices () {
      this.$route.router.go(`/operation/plugins/dealer/${this.$route.params.app_id}/list/${this.$route.params.dealer_id}/import_devices`)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
</style>
