<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.failure.main_title') }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="product.name" width='110px' size="small">
            <span slot="label">{{ $t('operation.warranty.product') }}</span>
            <select v-model="product">
              <option v-for="opt in productOptions" :value="opt">{{ opt.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :total="extendedSummary.rest.total" :title="extendedSummary.rest.title" :has-action="true" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="extendedSummary.unfinished.total" :title="extendedSummary.unfinished.title" :has-target="true" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="extendedSummary.today.total" :title="extendedSummary.today.title" align="left" :showchange="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="extendedSummary.week.total" :title="extendedSummary.week.title" align="left" :has-action="true" :showchange="true">
        </statistic>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="$t('common.all')" width='110px' size="small">
                  <span slot="label">{{ $t('common.display') }}</span>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="$t('common.placeholder.search')" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :rows="rows" :page="page" @tbody-id="goDetails"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  import * as config from 'consts/config'
  import { warrantyMixins } from '../../mixins'
  import api from 'api'
  export default {
    name: 'OrderList',

    mixins: [warrantyMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },

    components: {
    },

    data () {
      return {
        token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
        product: {},
        name: '',
        status: {
          label: this.$t('common.all'),
          value: 0
        },
        key: '',
        curProvince: {},
        curCity: {},
        curDistrict: {},
        workOrders: [],
        statusOptions: [{
          label: this.$t('common.all'),
          value: 0
        }, {
          label: this.$t('operation.warranty.failure.unexpired'),
          value: 1
        }, {
          label: this.$t('operation.warranty.failure.expired'),
          value: 2}],

        loadingData: false,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        total: 0,
        trends: null,
        headers: [
          {
            key: 'device_id',
            title: this.$t('operation.warranty.failure.columns.device_id')
          },
          {
            key: 'event_id',
            title: this.$t('operation.warranty.failure.columns.event_id')
          },
          {
            key: 'description',
            title: this.$t('operation.warranty.failure.columns.description')
          },
          {
            key: 'tag',
            title: this.$t('operation.warranty.failure.columns.tag')
          },
          {
            key: 'report_time',
            title: this.$t('operation.warranty.failure.columns.report_time'),
            sortType: -1
          },
          {
            key: 'state',
            title: this.$t('operation.warranty.failure.columns.state'),
            class: 'tac'
          }
        ],
        extendedSummary: {
          rest: {
            total: 0,
            change: 0,
            title: this.$t('operation.warranty.failure.summary.all')
          },
          unfinished: {
            total: 0,
            title: this.$t('operation.warranty.failure.summary.unfinished')
          },
          today: {
            total: 0,
            change: 0,
            title: this.$t('operation.warranty.failure.summary.today')
          },
          week: {
            total: 0,
            change: 0,
            title: this.$t('operation.warranty.failure.summary.week')
          }
        }
      }
    },

    computed: {
      productOptions () {
        if (this.products.length) {
          this.product = this.products[0]
        }
        return this.products
      },
      page () {
        return {
          currentPage: this.currentPage,
          countPerPage: this.countPerPage,
          total: this.total
        }
      },
      rows () {
        var result = []
        this.workOrders.map((item) => {
          var workOrder = {
            id: '<a class="hl-red">' + item.id + '</a>',
            mac: item.mac,
            invalid_time: item.invalid_time,
            time: item.time,
            addr: item.addr,
            state: resetState(item.state),
            prototype: item
          }
          result.push(workOrder)
        })
        return result
        function resetState (state) {
          var result = [
            {
              text: this.$t('operation.warranty.failure.pending'),
              color: '#6699CC'
            },
            {
              text: this.$t('operation.warranty.failure.extended_warranty'),
              color: '#006633'
            }
          ]
          var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
          return html
        }
      },
      queryCondition () {
        var condition = {
          filter: ['_id', 'name', 'product_name', 'product_type', 'extended_days', 'status'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {}
        }

        if (this.curProvince.name !== this.$t('common.any')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.name !== this.$t('common.any')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.name !== this.$t('common.any')) {
          condition.query.district = this.curDistrict.name
        }
        if (this.status.value !== 0) {
          if (this.status.value === 1) { // 未到期
            condition.query.status = 1
          } else if (this.status.value === 2) { // 已到期
            condition.query.status = 0
          }
        }
        if (this.key !== '') {
          condition.query._id = {$regex: this.key, $options: 'i'}
        }

        return condition
      }
    },

    route: {
      data () {
        this.getWarrantyList()
      }
    },

    ready () {},

    methods: {
      goDetails (table) {
        // 暂时隐藏
        // this.$route.router.go(this.$route.path + '/' + table.prototype.id)
      },
      getWarrantyList (querying) {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        api.warranty.getWarrantyList(this.$route.params.app_id, this.queryCondition).then((res) => {
          this.total = res.data.count
          this.workOrders = res.data.list
          this.loadingData = false
        }).catch((err) => {
          this.handleError(err)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .tips
    font-size 10px!important
    color red
</style>
