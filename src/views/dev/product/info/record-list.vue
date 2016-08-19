<template>
  <div class="main">
    <div class="main-title">
      <h2>产品信息</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getRecords" @search-activate="searching=!searching"  @press-enter="getRecords">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="getRecords" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @tbody-edit="getInfo"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import api from 'api'
import * as config from 'consts/config'
// import locales from 'consts/locales/index'
import Modal from 'components/Modal'
import Pager from 'components/Pager'
import Select from 'components/Select'
// import _ from 'lodash'
// import { globalMixins } from 'src/mixins'
// import { setCurrProductMixin } from './mixins'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import Statistic from 'components/Statistic2'
// import { formatDate } from 'src/filters'

export default {
  name: 'Authorize',

  // mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    'x-table': Table,
    'modal': Modal,
    'pager': Pager,
    'v-select': Select,
    Breadcrumb,
    Statistic,
    'search-box': SearchBox
  },

  data () {
    return {
      info: {
        id: '',
        auth_number: '',
        auth_member: '',
        create_time: '',
        product_id: '',
        attribute: [{
          mac: '',
          name: '',
          sn: ''
        }]
      },
      showAddModal: false,
      showAddModal2: false,
      showAddModal3: false,
      addModal: {},
      queryTypeOptions: [
        { label: '添加人', value: 'auth_member' }
      ],
      loadingData: false,
      addModel: {
        mac: '',
        sn: '',
        name: ''
      },
      queryType: { label: '添加人', value: 'auth_member' },
      key: '',
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      used: 0, // 已使用配额
      // recordSummary: {
      //   all: {
      //     count: 0,
      //     title: '授权额度'
      //   },
      //   used: {
      //     count: 0,
      //     title: '已使用'
      //   },
      //   rest: {
      //     count: 0,
      //     title: '剩余额度'
      //   }
      // },
      headers: [{
        key: 'time',
        title: '时间'
      }, {
        key: 'warrent',
        title: '授权数'
      }, {
        key: 'addman',
        title: '添加人'
      }, {
        key: 'edit',
        title: '操作'
      }],
      alerts: [{}, {}]
    }
  },

  route: {
    data () {
    }
  },

  computed: {
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.l32
  line-height 32px
.bt
  border-top 1px solid #d9d9d9
  margin-bottom 20px
</style>
