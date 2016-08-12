<template>
  <div class="main">
    <div class="main-title">
      <h2>升级列表</h2>
    </div>

    <div class="panel">
      <div class="panel-hd">
        <!-- <h2>设备列表</h2> -->
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>序号</th>
                <th>描述</th>
                <th class="tac">识别码</th>
                <th>起始版本</th>
                <th>目标版本</th>
                <th>升级进度</th>
                <th class="tac">状态</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="firmwares.length > 0">
                <tr v-for="firmware in firmwares">
                  <td>{{$index + 1}}</td>
                  <td>{{ firmware.content }}</td>
                  <td class="tac">{{ firmware.code }}</td>
                  <td>{{ firmware.start_version }}</td>
                  <td>{{ firmware.target_version }}</td>
                  <td>暂无</td>
                  <td class="tac"><a v-if="firmware.status === 0" href="##">启动</a><a v-else href="##">暂停</a> <a href="##">编辑</a></td>
                </tr>
              </template>
              <tr v-if="firmwares.length === 0 && !loadingData">
                <td colspan="7" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      <pager v-if="total > countPerPage" :total="firmwares.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import api from 'api'
import * as config from 'consts/config'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import locales from 'consts/locales/index'
// import _ from 'lodash'
import { formatDate } from 'src/filters'
// import { globalMixins } from 'src/mixins'
// import { productSummaryMixin, setCurrProductMixin } from './mixins'
import Statistic from 'components/Statistic2'

export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  // mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'v-select': Select,
    'c-table': Table,
    'modal': Modal,
    'search-box': SearchBox,
    'pager': Pager,
    Statistic
  },

  data () {
    var sortOrders = {}
    var descProperties = ['active_date']
    var ascProperties = ['mac']

    descProperties.forEach((key) => {
      sortOrders[key] = 'desc'
    })

    ascProperties.forEach((key) => {
      sortOrders[key] = 'asc'
    })

    return {
      firmwares: [
        {
          content: '这是描述',
          code: '123',
          start_version: 'v-1.0',
          target_version: 'v-2.0',
          status: 0
        },
        {
          content: '这是描述',
          code: '123',
          start_version: 'v-1.0',
          target_version: 'v-2.0',
          status: 1
        },
        {
          content: '这是描述',
          code: '123',
          start_version: 'v-1.0',
          target_version: 'v-2.0',
          status: 0
        },
        {
          content: '这是描述',
          code: '123',
          start_version: 'v-1.0',
          target_version: 'v-2.0',
          status: 1
        }
      ],
      visibility: {
        label: '全部',
        value: 'all'
      },
      visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingData: false,
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      }
    }
  },

  computed: {
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    tables () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: '<a class="hl-red">' + item.mac + '</a>',
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query['is_online'] = { $in: [true] }
          break
        case 'offline':
          condition.query['is_online'] = { $in: [false] }
          break
        case 'active':
          condition.query['is_active'] = { $in: [true] }
          break
        case 'inactive':
          condition.query['is_active'] = { $in: [false] }
          break
        default:
      }

      return condition
    }
  },

  route: {
    data () {
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
