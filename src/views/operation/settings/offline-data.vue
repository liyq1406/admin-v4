<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.settings.offline.main_title') }}</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <x-table :headers="columns" :tables="taskList" :page="pageInfo" :loading="loadingData" @current-page-change="onCurrPageChage" @tbody-url="getUrl" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getTasks">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
        </x-table>
      </div>
    </div>

    <!-- 下载地址浮层 Start -->
    <modal :show.sync="showModal" @close="showModal === false" width="540px">
      <h3 slot="header">{{ $t('operation.settings.offline.url') }}</h3>
      <div slot="body">
        <a :href="url" target="_blank" class="hl-red word-wrap">{{ url }}</a>
      </div>
    </modal>
    <!-- 下载地址浮层 End -->
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import formatDate from 'filters/format-date'
import wrapTag from 'filters/wrap-tag'
import toPercentage from 'filters/to-percentage'

export default {
  name: 'OfflineData',
  components: {
  },

  data () {
    let columns = 'operation.settings.offline.columns'
    return {
      showModal: false,
      url: '',
      loadingData: false,
      tasks: [],
      columns: [{
        key: 'status',
        title: this.$t(`${columns}.status`)
      }, {
        key: 'type',
        class: 'wp20',
        title: this.$t(`${columns}.type`)
      }, {
        key: 'begin_time',
        class: 'wp20',
        title: this.$t(`${columns}.begin_time`)
      }, {
        key: 'end_time',
        class: 'wp20',
        title: this.$t(`${columns}.end_time`)
      }, {
        key: 'url',
        class: 'wp20',
        title: this.$t(`${columns}.url`)
      }],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      visibility: {
        label: this.$t('common.all'),
        value: 'all'
      },
      visibilityOptions: []
    }
  },

  computed: {
    // 分页信息
    pageInfo () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 任务列表
    taskList () {
      return _.map(this.tasks, (item) => {
        let url = '-'
        let status

        if (item.status === 2) { // 导出中，显示百分比
          if (!item.finished) {
            status = '0%'
          } else {
            status = toPercentage(item.finished / item.total, 0)
          }
        } else { // 否则显示任务状态文案
          status = this._getTaskStatusLabel(item.status)
        }

        // 导出完成，显示百分比和下载链接
        if (item.status === 3) {
          url = `<a class="hl-red">${this.$t('operation.settings.offline.get_url')}</a>`
        }

        return {
          id: item.id,
          status: status, // 任务状态
          type: this._getTaskTypeLabel(item.type), // 导出类型
          begin_time: formatDate(item.begin_time), // 任务开始执行时间
          end_time: formatDate(item.end_time), // 任务结束执行时间
          url: url,
          origin: item
        }
      })
    },

    // 筛选条件
    queryCondition () {
      let condition = {
        filter: ['id', 'status', 'type', 'begin_time', 'end_time', 'finished', 'total'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: 'desc'
        }
      }

      if (this.visibility.value !== 'all') {
        condition.query['status'] = { $in: [this.visibility.value] }
      }

      return condition
    }
  },

  route: {
    data () {
      const STATUS = 'operation.settings.offline.status'

      this.visibilityOptions = [{
        label: this.$t('common.all'),
        value: 'all'
      }, {
        label: this.$t(`${STATUS}.to_be_exported`),
        value: 1
      }, {
        label: this.$t(`${STATUS}.exporting`),
        value: 2
      }, {
        label: this.$t(`${STATUS}.exported`),
        value: 3
      }, {
        label: this.$t(`${STATUS}.invalid`),
        value: 4
      }, {
        label: this.$t(`${STATUS}.expired`),
        value: 5
      }]
      this.getTasks()
    }
  },

  methods: {
    /**
     * 根据任务状态码获取状态名称
     * @author shengzhi
     * @param {Number} status 状态码
     */
    _getTaskStatusLabel (status) {
      const STATUS = 'operation.settings.offline.status'
      return ({
        '1': this.$t(`${STATUS}.to_be_exported`),
        '2': this.$t(`${STATUS}.exporting`),
        '3': wrapTag('100%', 'hl-green'),
        '4': wrapTag(this.$t(`${STATUS}.invalid`), 'hl-gray'),
        '5': wrapTag(this.$t(`${STATUS}.expired`), 'hl-gray')
      })[status]
    },

    /**
     * 根据任务状态码获取状态名称
     * @author shengzhi
     * @param {Number} type 类型
     */
    _getTaskTypeLabel (type) {
      const TYPE = 'operation.settings.offline.types'
      return ({
        '1': this.$t(`${TYPE}.device`),
        '2': this.$t(`${TYPE}.user`),
        '3': this.$t(`${TYPE}.alert`),
        '4': this.$t(`${TYPE}.heavy_buyer`),
        '5': this.$t(`${TYPE}.dealer`),
        '6': this.$t(`${TYPE}.warranty`),
        '7': this.$t(`${TYPE}.device_session_log`)
      })[type]
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getTasks()
    },

    /**
     * 获取离线任务列表
     * @author shengzhi
     * @param  {Boolean} reset 是否重置当前页
     */
    getTasks (reset) {
      if (reset) {
        this.currentPage = 1
      }

      this.loadingData = true
      api.exportTask.getTasks(this.queryCondition).then((res) => {
        // 以下为虚拟数据，测试用，勿删
        // 虚拟数据开始
        // res.data.list = [{
        //   id: '12345',
        //   status: 1,
        //   type: 1,
        //   begin_time: '2014-10-09T08:15:40.843Z',
        //   end_time: '2014-10-09T08:15:40.843Z',
        //   finished: 0,
        //   total: 54321
        // }, {
        //   id: '12345',
        //   status: 2,
        //   type: 2,
        //   begin_time: '2014-10-09T08:15:40.843Z',
        //   end_time: '2014-10-09T08:15:40.843Z',
        //   finished: 12345,
        //   total: 54321
        // }, {
        //   id: '12345',
        //   status: 3,
        //   type: 3,
        //   begin_time: '2014-10-09T08:15:40.843Z',
        //   end_time: '2014-10-09T08:15:40.843Z',
        //   finished: 54321,
        //   total: 54321
        // }]
        // res.data.count = 3
        // 虚拟数据结束

        this.tasks = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    /**
     * 获取地址
     * @author shengzhi
     */
    getUrl (data) {
      let taskId = data.origin.id
      this.url = ''

      api.exportTask.getTaskUrl(taskId).then((res) => {
        this.url = decodeURIComponent(res.data.link_url)
        this.showModal = true
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
