<template>
  <div class="main">
    <div class="main-title">
      <h2>产品信息</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <div class="infolist">
                  添加时间： {{create_time}}
                </div>
                <div class="infolist">
                  添加人： {{creater}}
                </div>
                <div class="infolist">
                  导入数量： {{total}}
                </div>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost ml10" @click="showExportQRCode = true">批量导出二维码</button>
              </div>
            </div>
            <!-- <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :placeholder="$t('common.placeholder.search')" :active="searching" @cancel="getRecords" @search-activate="searching=!searching"  @press-enter="getRecords">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getRecords" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div> -->
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @tbody-edit="getList"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
    <batch-export-qr :show.sync="showExportQRCode"></batch-export-qr>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
// import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
// import { setCurrProductMixin } from './mixins'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import Statistic from 'components/Statistic2'
import formatDate from 'filters/format-date'
import BatchExportQr from './batch-export-qr'

export default {
  name: 'Authorize',

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    'x-table': Table,
    'pager': Pager,
    'x-select': Select,
    Breadcrumb,
    Statistic,
    'search-box': SearchBox,
    BatchExportQr
  },

  data () {
    return {
      showExportQRCode: false,
      records: [],
      create_time: '',
      creater: '',
      queryTypeOptions: [
        { label: 'mac', value: 'mac' }
      ],
      loadingData: false,
      queryType: { label: 'mac', value: 'mac' },
      key: '',
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      headers: [{
        key: 'mac',
        title: 'Mac'
      }, {
        key: 'deviceID',
        title: '设备ID',
        class: 'wp20'
      }, {
        key: 'sn',
        title: '序列号(SN)',
        class: 'wp30'
      }],
      breadcrumbNav: [{
        label: '全部',
        link: '/dev/products/' + this.$route.params.id + '/authorize'
      }, {
        label: '添加纪录'
      }]
    }
  },

  route: {
    data () {
      this.getList()
    }
  },

  computed: {
    queryCondition () {
      var condition = {
        // filter: ['_id', 'auth_number', 'auth_member', 'create_time', 'product_id'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    },
    // 导入列表
    tables () {
      var result = []
      this.records.map((item) => {
        var device = {
          mac: item.mac,
          deviceID: item.device_id,
          sn: (item.sn && item.sn.length) ? item.sn : '-',
          prototype: item
        }
        result.push(device)
      })
      return result
    }
  },

  methods: {
    // 获取导入记录
    getList () {
      // var params = [this.$route.params.id]
      api.product.getRecordInfo(this.$route.params.id, this.$route.params.import_id, this.queryCondition.limit, this.queryCondition.offset).then((res) => {
        if (res.status === 200) {
          // console.log(res.data)
          this.create_time = formatDate(res.data.create_time)
          this.creater = res.data.auth_member
          this.total = res.data.attribute.length
          this.records = res.data.attribute
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getList(true)
    },
    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.mt10
  margin-top 10px
.l32
  line-height 32px
.bt
  border-top 1px solid #d9d9d9
  margin-bottom 20px
.infolist
  display inline-block
  margin-right 10px
  line-height 28px
</style>
