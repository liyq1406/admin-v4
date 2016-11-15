<template>
  <div class="main">
    <div class="main-title bordered mb10">
      <h2>APP启动图片</h2>
    </div>
    <div v-if="filterPlugins.length">
      <div class="filter-bar">
        <div class="filter-group fl">
          <div class="filter-group-item">
            <x-select :label="currentPlugin.name" width="110px" size="small">
              <span slot="label">选择应用</span>
              <select v-model="currentPlugin" @change="getSplashWnd">
                <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
                <option v-for="plugin in filterPlugins" :value="plugin">{{ plugin.name }}</option>
              </select>
            </x-select>
            <button class="btn btn-primary" :disabled="list.length === 5" :class="{'disabled':list.length === 5}" v-link="{ path: '/operation/plugins/splashwnd/' + this.$route.params.app_id + '/list/' + currentPlugin.id + '/add' }"><i class="fa fa-plus"></i>添加启动图片</button>
          </div>
        </div>
        <div class="filter-group fr tips-text">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i>提示：添加应用启动闪屏图片，最多只能添加5张
        </div>
      </div>
      <div class="panel">
        <div class="panel-bd">
          <x-table :headers="headers" @selected-change="" @tbody-picture-id="showPic" @tbody-picture-url="showUrl" @tbody-edit="getInfo" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
          </x-table>
        </div>
      </div>
    </div>
    <div v-else style="text-align:center;line-height:200px">
      暂无应用
    </div>
    <!-- 查看图片浮层-->
    <modal :show.sync="showModal">
      <h3 slot="header">查看图片</h3>
      <div slot="body">
        <img :src="imgsrc" alt="" style="width:100%">
      </div>
      <div slot="footer" class="modal-footer" style="background-color:#fff">
        <button @click.prevent.stop="showModal = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
    <!-- 查看下载地址浮层-->
    <modal :show.sync="showModal2">
      <h3 slot="header">查看下载地址</h3>
      <div slot="body">
        <span>{{url}}</span>
      </div>
      <div slot="footer" class="modal-footer" style="background-color:#fff">
        <button @click.prevent.stop="showModal2 = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import formatDate from 'filters/format-date'
// import { setCurrPlugin } from 'store/actions/plugins'

// TODO 消除代码冗余 #weijie

export default {
  name: 'Alerts',
  components: {
  },

  vuex: {
    getters: {
      plugins: ({ plugins }) => plugins.all
    }
  },

  data () {
    return {
      url: '',
      imgsrc: '',
      corp: {},
      currentPlugin: {
        id: ''
      },
      list: [],
      key: '',
      alerts: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      showModal: false,
      showModal2: false,
      model: {
        id: '',
        type: 1,
        product_name: '',
        alert_name: '',
        alert_value: '',
        notify_type: 1,
        from: '',
        to: [],
        content: '',
        create_date: '',
        is_read: false,
        tags: ''
      },
      product_id: '',
      alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
      informTypes: locales[Vue.config.lang].data.INFORM_TYPES,
      today: formatDate(new Date(), 'yyyy-MM-dd'),
      loadingData: false,
      startTimePick: '',
      endTimePick: '',
      headers: [{
        key: 'picture_id',
        title: '图片ID'
      }, {
        key: 'picture_description',
        title: '图片描述'
      }, {
        key: 'create_time',
        title: '更新时间'
      }, {
        key: 'picture_size',
        title: '图片大小'
      }, {
        key: 'edit',
        title: '操作'
      }],
      showBatchBtn: false,
      dealList: [],
      selecting: true
    }
  },

  computed: {
    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    filterPlugins () {
      var arr = this.plugins.filter((item) => {
        return item.type !== 10
      })
      return arr
    },

    tables () {
      var result = []
      this.list.forEach((item) => {
        let obj = {
          picture_id: '<a>' + item.picture_id + '</a>',
          picture_description: item.picture_description,
          create_time: formatDate(item.create_time),
          picture_size: item.picture_size,
          edit: '<a>编辑</a>',
          prototype: item
        }
        result.push(obj)
      })
      return result
    },

    selectedPlugin () {
      var plugin = this.currentPlugin
      return plugin
    }
  },

  filters: {
  },

  route: {
    data () {
      this.getFirstPlugin()
      // this.getCorpInfo()
    }
  },

  // 监听属性变动
  watch: {
    plugins () {
      this.getFirstPlugin()
      if (this.filterPlugins.length > 0) {
        // this.getAlerts()
      }
    }
  },

  methods: {
    /**
     * 获取企业信息
     * @author shengzhi
     */
    getCorpInfo () {
      api.corp.getCorpInfo().then((res) => {
        this.corp = res.data
        this.getSplashWnd()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getSplashWnd () {
      if (this.currentPlugin.id) {
        var params = {
          corp_id: this.corp.id,
          app_id: this.currentPlugin.id
        }
        api.plugin.getSplashWnd(params).then((res) => {
          this.list = res.data.list
        }).catch((res) => {
          this.handleError(res)
        })
      }
    },
    getPlugins () {
      api.plugin.all().then((res) => {
        if (res.status === 200) {
          this.getAllPlugin(res.data.list)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取第一个产品@author weijie
    getFirstPlugin () {
      this.currentPlugin = this.filterPlugins[0] || {}
      // setTimeout(() => {
      //   this.getTagTrend()
      // }, 3000)
      this.getCorpInfo()
    },

    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      // this.getAlerts()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      // this.getAlerts()
    },

    /**
     * 按某个属性排序
     * @author shengzhi
     * @param  {Object} header 表头
     * @param  {Number} 索引
     */
    sortBy (header, index) {
      header.sortType = header.sortType * -1
      this.headers.$set(index, header)
      // this.getAlerts()
    },
    /**
     * 获取单条告警信息并弹出浮层显示
     * @param  {Object} alert 目标告警信息
     */
    showAlert (alert) {
      this.model = alert
      this.showModal = true
      api.alert.setAlertRead([alert.id]).then((res) => {
        if (res.status === 200) {
          alert.is_read = true
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 跳转详情信息
    getInfo (table, header, index) {
      // console.log(table)
      this.$route.router.go('/operation/plugins/splashwnd/' + this.$route.params.app_id + '/list/' + this.currentPlugin.id + '/edit/' + table.prototype.picture_id)
      // this.$route.router.go('/operation/alerts/record')
    },
    // 打开图片预览
    showPic (table, header, index) {
      // console.log(table)
      this.imgsrc = ''
      this.showModal = true
      this.imgsrc = table.prototype.picture_url
    },
    // 打开下载链接
    showUrl (table, header, index) {
      // console.log(table)
      this.url = ''
      this.showModal2 = true
      this.url = table.prototype.picture_url
    }
  }
}
</script>
<style lang="stylus" scoped>
.filter-bar
  padding 7px 15px

.tips-text
  color #2698DD
  line-height 28px
</style>
