<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>升级列表</h2>
    </div>
    <div class="panel mt15">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <!-- <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div> -->
            </div>
            <div class="filter-group">
              <x-select width="120px" size="small" placeholder="请选择产品" :label="currProduct.name">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="currProduct" name="product" @change="Productstatus">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th width="8%">序号</th>
                <th width="20%">描述</th>
                <th width="10%">识别码</th>
                <th width="10%">起始版本</th>
                <th width="10%">目标版本</th>
                <th>升级进度</th>
                <th width="18%" class="tac">状态</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tasks.length > 0">
                <tr v-for="task in tasks">
                  <td>{{$index + 1}}</td>
                  <td>{{ task.description }}</td>
                  <td><span v-if="task.identify===0">-</span><span v-else>{{ task.identify }}</span></td>
                  <td>{{ task.from_version }}</td>
                  <td>{{ task.target_version }}</td>
                  <td>
                    <!-- 没有升级进度 -->
                    <div v-if="task.type !== 3">
                      <progress :count="task.upgrade_count" :max="task.upgrade_count" :pause="false" :show-percent="false" :show-text="false"></progress>
                    </div>
                    <div v-else>
                      <progress :count="task.upgrade_count" :max="task.surplus_count" :pause="task.status"></progress>
                    </div>
                  </td>
                  <td class="tac">
                    <!-- <a v-if="task.status === 0" href="#" class="hl-red" @click="toggleTaskStatus(item)">启动</a><a v-else href="##" class="hl-red" @click="changeStatus(item)">暂停</a><a href="#" class="hl-red ml10">删除</a> -->
                    <button :disabled="toggling" @click="toggleTaskStatus(task)" class="btn btn-ghost btn-sm btn-mini mr10">{{ task.status ? $t('ui.task.stop') : $t('ui.task.start') }}</button><button @click="removeTask(task)" class="btn btn-ghost btn-sm btn-mini">删除</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tasks.length === 0 && !loadingData">
                <td colspan="7" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      <pager v-if="total > countPerPage" :total="tasks.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import SearchBox from 'components/SearchBox'
import Progress from 'components/Progress'
import Table from 'components/Table'
import locales from 'consts/locales/index'
// import _ from 'lodash'
// import { formatDate } from 'src/filters'
// import { globalMixins } from 'src/mixins'
// import { productSummaryMixin, setCurrProductMixin } from './mixins'
import Statistic from 'components/Statistic2'

export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  // mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'x-select': Select,
    'x-table': Table,
    Modal,
    SearchBox,
    Pager,
    Statistic,
    Progress
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
      query: '',
      searching: false,
      tasks: [
        // {
        //   description: '这是描述',
        //   code: '123',
        //   start_version: 'v-1.0',
        //   target_version: 'v-2.0',
        //   max: 50000,
        //   count: 45677,
        //   status: 0
        // },
        // {
        //   description: '这是描述',
        //   code: '123',
        //   start_version: 'v-1.0',
        //   target_version: 'v-2.0',
        //   max: 60000,
        //   count: 15666,
        //   status: 1
        // },
        // {
        //   description: '这是描述',
        //   code: '123',
        //   start_version: 'v-1.0',
        //   target_version: 'v-2.0',
        //   max: 100000,
        //   count: 100000,
        //   status: 1
        // },
        // {
        //   description: '这是描述',
        //   code: '123',
        //   start_version: 'v-1.0',
        //   target_version: 'v-2.0',
        //   max: 50000,
        //   count: 350,
        //   status: 1
        // }
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
      },
      products: [],
      currProduct: {}
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
    }
  },

  route: {
    data () {
      this.getProducts()
    }
  },

  methods: {
    // 获取产品列表
    getProducts () {
      this.loadingProducts = true
      api.product.all().then((res) => {
        this.loadingProducts = false
        this.products = res.data
        if (this.products.length === 0) {
          return
        }
        this.currProduct = this.products[0]
        // this.getFirmwares()
        this.getTasks()
      }).catch((res) => {
        this.handleError(res)
        this.loadingProducts = false
      })
    },
    Productstatus () {
      // this.getFirmwares()
      this.getTasks()
    },
    getTasks () {
      this.loadingTasks = true
      api.firmware.taskList(this.currProduct.id).then((res) => {
        if (res.status === 200) {
          this.tasks = res.data
          this.total = res.data.length
          this.loadingTasks = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingTasks = false
      })
    },
    // 切换任务状态
    toggleTaskStatus (task) {
      if (!this.toggling) {
        this.toggling = true
        api.firmware.toggleTaskStatus({
          product_id: this.currProduct.id,
          upgrade_task_id: task.id,
          status: task.status ? 0 : 1
        }).then((res) => {
          if (res.status === 200) {
            task.status = !task.status
            this.toggling = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.toggling = false
        })
      }
    },
    // 删除升级任务
    removeTask (task) {
      var result = window.confirm('确认删除该升级任务吗？')
      if (result === true) {
        api.firmware.removeTask({
          id: task.id,
          product_id: this.currProduct.id
        }).then((res) => {
          if (res.status === 200) {
            this.getTasks()
          }
        }).catch((res) => {
          this.handleError(res)
          this.toggling = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
