<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>产品信息</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16">
            <div class="product-info">
              <info-card class="mb15" :pic="(currentProduct.pics && currentProduct.pics.length) ? currentProduct.pics[0] : ''">
                <div class="product-name">{{ currentProduct.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></div>
                <div class="product-createtime">{{ currentProduct.create_time | formatDate }}</div>
              </info-card>
              <div class="actions" v-show="currentProduct.name">
                <span class="released" v-if="currentProduct.is_release"><i class="fa fa-check"></i>已发布</span>
                <button class="btn btn-ghost" @click="releaseProduct" v-else>发布产品</button>
              </div>
            </div>
            <div v-stretch="182">
              <info-list :info="productInfo">
                <a class="hl-red" slot="key" @click.prevent="displayKey">点击查看</a>
                <a class="hl-red" slot="qrcode" @click.prevent="displayQrcode">点击查看</a>
              </info-list>
            </div>
          </div>
          <div class="col-8">
            <div class="annuls-chart">
              <chart :options="quotaOptions" :loading="firstRequest"></chart>
              <div class="quota" v-show="!rendering">
                <div class="quota-tit">产品配额</div>
                <div class="quota-sum">{{ currentProduct.quota }}</div>
              </div>
            </div>
            <div class="buy-access hidden">
              <button class="btn btn-primary" @click="onBuyButtonClick">购买授权</button>
            </div>
            <div class="buy-record hidden">
              <span>购买记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2 class="fl mr20">设备列表</h2>
        <a v-link="{path: 'authorize'}" class="btn btn-primary">管理授权</a>
        <!-- <button class="btn btn-ghost ml10" @click="showExportQRCode = true">批量导出二维码</button> -->
      </div>
      <div class="panel-bd mt15">
        <x-table :headers="headers" :rows="rows" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @tbody-sn="onShowDeviceEditModal">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click="showBatchModal">
                <i class="fa fa-reply-all"></i>
                批量修改数据端点</button>
                <search-box
                  :key="query"
                  :active="searching"
                  :placeholder="$t('common.placeholder.search')"
                  :max="(queryType.value === 'id'?2100000000: false)"
                  @cancel="getDevices(true)"
                  @search-activate="toggleSearching"
                  @search-deactivate="toggleSearching"
                  @search="handleSearch"
                  @press-enter="getDevices(true)">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getDevices(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getDevices(true)">
                  <option v-for="option in locales.data.DEVICE_VISIBILITY_OPTIONS" :value="option">{{ option.label }}</option>
                </select>
              </x-select>

              <span class="">激活时间: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>
            </div>
          </div>
          <button v-link="{path: 'online-offline-records', append: true}" class="btn btn-ghost mt10" slot="left-foot"><i class="fa fa-list"></i>查看上下线历史记录</button>
        </x-table>
      </div>
    </div>

    <!-- 查看产品密钥浮层 -->
    <modal :show.sync="showKeyModal">
      <h3 slot="header">{{ $t("ui.overview.key") }}</h3>
      <div slot="body" class="product-key tac">{{ productKey }}</div>
    </modal>

    <!-- 查看二维码浮层 -->
    <modal :show.sync="showQrcodeModal">
      <h3 slot="header">二维码</h3>
      <div slot="body" class="qrcode">{{ currentProduct.qrcode || 'XQR:T:P;V:1;PID:'+$route.params.id+';;' }}</div>
    </modal>
    <!-- 批量导入浮层 -->
    <modal :show.sync="isShowBatchModal" @close="onBatchCancel">
      <h3 slot="header">批量修改数据端点</h3>
      <div slot="body" class="form">
        <form autocomplete="off" @submit.prevent="">
          <div class="form-row row">
            <!-- <label class="form-control col-6">导入:</label> -->
            <p>您可以通过标准文件批量导入数据端点，<a href="/static/files/import_datapoint.csv" class="hl-red">查看示例</a></p>
            <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
              <input type="file" v-el:mac-file name="macFile" @change.prevent="selectFile"/><i class="fa fa-reply-all"></i> 批量修改数据端点
            </label>
            <span class="file-name">{{ file.name }}</span>
            <p class="hl-gray">* 仅限csv格式文件</p>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="batchImport" :disabled="importing" :class="{'disabled':importing}" v-text="importing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onBatchCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>

    <!-- 编辑设备浮层 -->
    <modal :show.sync="showDeviceEditModal">
      <h3 slot="header">编辑设备</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onDeviceEditModalSubmit">
            <div class="form-row row">
              <label class="form-control col-4">SN:</label>
              <div class="controls col-20">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="deviceEditModal.sn" type="text" name="deviceEditModal.sn" v-validate:sn="{format: 'sn', maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.sn.modified && $validation.sn.format">{{ $t('common.validation.sn') }}</span>
                  <span v-if="$validation.sn.touched && $validation.sn.modified && $validation.sn.maxlength">{{ $t('common.validation.maxlength', ['序列号', 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="showDeviceEditModal = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>

    <!-- 提示浮层 -->
    <modal :show.sync="isShowTipsModal" @close="onTipsCancel">
      <h3 slot="header">提示</h3>
      <div slot="body">
        <alert type="success" title="" :cols="22" v-if="tips.type==='import-success'">
          <p>设备导入成功</p>
        </alert>
        <alert type="warning" title="" :cols="22" v-else>
          <p>{{ tips.msg }}</p>
        </alert>
        <div class="row" v-if="tips.deviceArr || tips.datapointArr">
          <div class="col-11">
            <div class="tips-tit">不正确的设备</div>
            <div class="tips-box">
              <div class="tips-box-item" v-for="item in tips.deviceArr">{{ item.trim() }}</div>
            </div>
          </div>
          <div class="col-11 col-offset-2">
            <div class="tips-tit">不正确的数据端点</div>
            <div class="tips-box">
              <div class="tips-box-item" v-for="item in tips.datapointArr">{{ item.trim() }}</div>
            </div>
          </div>
        </div>

      </div>
      <div slot="footer" class="modal-footer">
        <button @click.prevent.stop="onTipsCancel" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import api from 'api'
import { setCurrProductMixin } from '../mixins'
import { removeProduct, updateProduct } from 'store/actions/products'
import * as config from 'consts/config'
import Chart from 'components/chart/index'
import formatDate from 'filters/format-date'
// import BatchExportQr from './batch-export-qr'

export default {
  name: 'ProductInfo',

  mixins: [setCurrProductMixin],

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    Chart
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
      isShowBatchModal: false,
      isShowTipsModal: false,
      file: {},
      tips: {},
      importing: false,
      // showExportQRCode: false,
      firstRequest: true,
      showQrcodeModal: false,
      query: '',
      sortKey: '',
      sortOrders: sortOrders,
      searching: false,
      visibility: {
        label: '全部',
        value: 'all'
      },
      used: 0,
      devices: [],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      page: {
        total: 20, // 数据总数
        currentPage: 1, // 当前页
        countPerPage: 10 // 每页数量
      },
      loadingData: false,
      loadingFields: false,
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: 'SN', value: 'sn' },
        { label: '设备ID', value: 'id' },
        { label: '设备名称', value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      showKeyModal: false,
      productKey: '',
      delChecked: false,
      showDeviceEditModal: false,
      deviceEditModal: {
        sn: ''
      },
      // 默认字段
      base_fields: [
        {
          'name': 'id',
          'label': '产品ID',
          'hidden': false,
          'sort': 1,
          'value_type': 1,
          'default_value': ''
        },
        {
          'name': 'name',
          'label': '产品名称',
          'hidden': true,
          'sort': 2,
          'value_type': 1,
          'default_value': ''
        },
        {
          'name': 'mode',
          'label': '产品型号',
          'hidden': false,
          'sort': 3,
          'value_type': 1,
          'default_value': ''
        },
        {
          'name': 'type',
          'label': '产品类型',
          'hidden': false,
          'sort': 4,
          'value_type': 2,
          'default_value': ''
        },
        {
          'name': 'link_type',
          'label': '连接类型',
          'hidden': false,
          'sort': 5,
          'value_type': 2,
          'default_value': ''
        },
        {
          'name': 'description',
          'label': '产品描述',
          'hidden': false,
          'sort': 6,
          'value_type': 1,
          'default_value': ''
        }
      ],
      headers: [{
        key: 'mac',
        title: 'MAC'
      }, {
        key: 'id',
        title: '设备ID',
        class: 'wp25'
      }, {
        key: 'is_active',
        title: '是否激活',
        tooltip: '设备已联网激活',
        class: 'wp10'
      }, {
        key: 'active_date',
        title: '激活时间',
        sortType: -1,
        class: 'wp20'
      }, {
        key: 'sn',
        title: 'SN'
      // }, {
      //   key: 'firmware',
      //   title: '固件版本号',
      //   class: 'tac'
      }, {
        key: 'is_online',
        title: '在线状态',
        sortType: -1,
        class: 'wp10'
      }],
      productFields: {},
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date()
    }
  },

  computed: {
    // 产品配额
    annulusInfo () {
      let used = (this.used >= this.currentProduct.quota) ? this.currentProduct.quota : this.used
      // 剩余配额
      let remain = this.currentProduct.quota ? this.currentProduct.quota - used : 0

      return [{
        name: '授权设备',
        value: used
      }, {
        name: '剩余配额',
        value: remain
      }]
    },

    // 配额图表选项
    quotaOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [{
          name: '数量',
          type: 'pie',
          avoidLabelOverlap: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          radius: ['50%', '70%'],
          // center: ['50%', '60%'],
          label: {
            normal: {
              show: false
            }
          },
          data: this.annulusInfo,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 字段列表
    fields () {
      var result = []
      var baseFields = this.base_fields
      if (this.productFields.base_fields && this.productFields.base_fields.length) {
        baseFields = this.productFields.base_fields
      }
      baseFields.forEach((item, index) => {
        var field = _.clone(item)
        field.category = this.baseFieldKeys.indexOf(item.name) >= 0 ? 'base_fields' : 'custom_fields'
        result.push(field)
      })
      result.sort((a, b) => {
        return a.sort - b.sort
      })
      result.forEach((item, index) => {
        item.sort = index + 1
      })
      return result
    },

    /**
     * 基本字段key表
     */
    baseFieldKeys () {
      var result = this.base_fields.map((item) => {
        return item.name
      })
      return result || []
    },

    // 设备列表
    rows () {
      var result = []
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: item.mac,
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          sn: '<a class="hl-red">' + (item.sn || ' - ') + '</a>',
          firmware: item.firmware,
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      let condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'firmware', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['active_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
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
    },

    // 产品信息
    productInfo () {
      let result = {}
      // 产品基本字段信息
      let product = {
        id: this.currentProduct.id,
        mode: this.currentProduct.mode || '-',
        type: this.getTypeLabelByValue(this.currentProduct.type),
        link_type: this.locales.data.DEVICE_TYPES[this.currentProduct.link_type - 1],
        description: this.currentProduct.description
      }

      // 根据字段设置筛选字段
      _.forEach(this.fields, (item) => {
        if (item.hidden) return

        if (product.hasOwnProperty(item.name)) {
          result[item.name] = {
            label: item.label,
            value: product[item.name]
          }
        } else {
          result[item.name] = {
            label: item.label,
            value: item.default_value
          }
        }
      })

      // 默认显示产品密钥和二维码
      result.key = {
        label: '产品密钥',
        slot: true
      }
      result.qrcode = {
        label: '产品二维码',
        slot: true
      }

      return result
      // return {
      //   mode: {
      //     label: '产品型号',
      //     value: this.currentProduct.mode || '-'
      //   },
      //   type: {
      //     label: '产品类型',
      //     value: this.getTypeLabelByValue(this.currentProduct.type)
      //   },
      //   link_type: {
      //     label: '连接类型',
      //     value: this.locales.data.DEVICE_TYPES[this.currentProduct.link_type - 1]
      //   },
      //   id: {
      //     label: '产品ID',
      //     value: this.currentProduct.id
      //   },
      //   description: {
      //     label: '产品描述',
      //     value: this.currentProduct.description
      //   },
      //   key: {
      //     label: '产品密钥',
      //     slot: true
      //   },
      //   qrcode: {
      //     label: '产品二维码',
      //     slot: true
      //   }
      // }
    }
  },

  route: {
    data () {
      // 切换产品不切换路由的时候重置上次的编辑状态
      this.delChecked = false
      this.query = ''
      this.currentPage = 1
      // 初次获取设备列表，并将获取的数量作为已用配额
      this.firstRequest = true
      this.getDevices()
      this.getData()
      // let condition = {
      //   filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'sn', 'last_login'],
      //   limit: this.countPerPage,
      //   offset: 0,
      //   order: this.sortOrders
      // }
      // api.device.getList(this.$route.params.id, condition).then((res) => {
      //   console.log(res.data)
      //   this.devices = res.data.list
      //   this.used = this.total = res.data.count
      // }).catch((res) => {
      //   this.handleError(res)
      // })
    }
  },

  methods: {
    /**
     * 选择文件
     */
    selectFile () {
      this.file = this.$els.macFile.files[0]
    },
    /**
     * 关闭批量导入浮层
     */
    onBatchCancel () {
      this.$els.macFile.value = ''
      this.file = {}
      this.importing = false
      this.isShowBatchModal = false
    },

    /**
     * 显示批量浮层
     * @return {[type]} [description]
     */
    showBatchModal () {
      this.isShowBatchModal = true
    },
    /**
     * 批量导入
     */
    batchImport () {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var reader = new window.FileReader()

        // 没选择文件
        if (!this.file.name) {
          this.showNotice({
            type: 'error',
            content: '请上传导入设备文件'
          })
          return false
        }

        // 导入文件类型不合法
        if (!/\.csv$/.test(this.file.name)) {
          this.showNotice({
            type: 'error',
            content: this.file.name + this.$t('common.upload.type_tips')
          })
          return false
        }

        reader.onerror = (evt) => {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.read_err')
          })
        }
        this.importing = true
        // 读取完成
        reader.onloadend = (evt) => {
          if (evt.target.readyState === window.FileReader.DONE) {
            var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n')
            macArr = _.compact(macArr)
            // console.log(macArr.slice(1))
            // 获取数据端点的index
            let keyObj = []
            macArr.slice(0, 1).map((key) => {
              keyObj = key.split(',')
              keyObj = keyObj.slice(1)
            })
            macArr = macArr.slice(1).map((item) => {
              let macObj = item.split(',')
              let result = {
                mac: macObj[0] ? macObj[0].trim() : '',
                datapoints: []
              }
              macObj = macObj.slice(1)
              for (let i = 0; i < macObj.length; i++) {
                if (macObj[i] && macObj[i].trim()) {
                  var obj = {}
                  obj.index = keyObj[i]
                  obj.value = macObj[i]
                  result.datapoints.push(obj)
                }
              }
              // if (macObj[1] && macObj[1].trim()) result.sn = macObj[1].trim()
              // if (macObj[2] && macObj[2].trim()) result.name = macObj[2].trim()
              return result
            })
            api.product.editDatapoint(this.$route.params.id, macArr).then((res) => {
              if (res.status === 200) {
                // this.showNotice({
                //   type: 'success',
                //   content: this.$t('common.upload.success_msg')
                // })
                this.onBatchCancel()
                this.isShowTipsModal = true
                this.tips = {
                  type: 'import-success',
                  recordId: res.data.import_record_id
                }
              }
              this.importing = false
            }).catch((res) => {
              this.onBatchCancel()
              this.handleImportError(res)
              this.importing = false
            })
          }
        }
        reader.readAsText(this.file)
      } else {
        this.showNotice({
          type: 'error',
          content: this.$t('common.upload.compatiblity')
        })
      }
    },

    /**
     * 处理导入错误
     * @author shengzhi
     * @params {Object} res 响应信息
     */
    handleImportError (res) {
      let code = res.data.error.code
      const ERRORS = {
        '4001001': {
          type: 'error',
          msg: '请求字段缺少'
        },
        '4041007': {
          type: 'error',
          msg: '数据端点不存在 '
        },
        '4001183': {
          type: 'error-duplicated-data',
          msg: '数据端点不是应用类型'
        },
        '4041008': {
          type: 'error-duplicated-items',
          msg: '设备不存在'
        }
      }

      if (ERRORS.hasOwnProperty(code)) {
        this.isShowTipsModal = true
        let tips = ERRORS[code]
        // let msg = res.data.error.msg.split('],[')
        let msg = res.data.error.msg

        if (code === 4041008) {
          let begin = msg.indexOf('[')
          let end = msg.indexOf(']')
          let arr = msg.substr(begin + 1, end - begin - 1)
          arr = arr.split(', ')
          // console.log(arr)
          tips.deviceArr = arr
          // tips.deviceArr = msg.replace('[', '').split(',')
          // tips.datapointArr = msg.replace(']', '').split(',')
        } else if (code === 4001183) {
          let begin = msg.indexOf('index[')
          let end = msg.indexOf('] source')
          let arr = msg.substr(begin + 6, end - begin - 6)
          arr = arr.split(', ')
          // console.log(arr)
          tips.datapointArr = arr
        } else if (code === 4041007) {
          let begin = msg.indexOf('datapoint[')
          let end = msg.indexOf('] index')
          let arr = msg.substr(begin + 10, end - begin - 10)
          arr = arr.split(', ')
          console.log(arr)
          tips.datapointArr = arr
        }
        this.tips = tips
      } else {
        this.handleError(res)
      }
    },

    /**
     * 关闭提示浮层
     */
    onTipsCancel () {
      this.isShowTipsModal = false
      this.tips = {}
    },
    /**
     * 向服务器获取数据
     * @return {[type]} [description]
     */
    getData () {
      this.loadingFields = true
      api.customization.getProductCustomization(this.$route.params.id).then((res) => {
        this.productFields = res.data || {}
        this.loadingFields = false
      }).catch((res) => {
        this.loadingFields = false
        this.handleError(res)
      })
    },

    /**
     * 设置SN
     */
    setSn () {
      let productId = this.$route.params.id
      let deviceId = this.deviceEditModal.deviceId
      let params = {
        sn: this.deviceEditModal.sn
      }
      api.product.updateDeviceMsg(productId, deviceId, params).then((res) => {
        this.getDevices()
        this.showDeviceEditModal = false
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * sn编辑浮层提交表单
     * @return {[type]} [description]
     */
    onDeviceEditModalSubmit () {
      this.setSn()
      // if (this.deviceEditModal.sn.length) {
      //   this.setSn()
      // } else {
      //   this.showNotice({
      //     type: 'error',
      //     content: '请输入设备sn'
      //   })
      // }
    },
    /**
     * 显示sn编辑浮层
     * @param  {[type]} device [description]
     * @return {[type]}        [description]
     */
    onShowDeviceEditModal (device) {
      this.deviceEditModal.sn = device.prototype.sn
      this.deviceEditModal.deviceId = device.id
      this.showDeviceEditModal = true
    },
    /**
     * 处理购买按钮点击
     * @author shengzhi
     */
    onBuyButtonClick () {
    },

    // 查看产品密钥
    displayKey () {
      api.product.getProductKey(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.productKey = res.data.key
          this.showKeyModal = true
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 查看二维码
     * @author shengzhi
     */
    displayQrcode () {
      this.showQrcodeModal = true
    },

    /**
     * 通过值获取产品类型
     * @author shengzhi
     * @param {Number} val 目标值
     */
    getTypeLabelByValue (val) {
      let result = '-'
      let type = _.find(this.locales.data.PRODUCT_TYPES, (item) => {
        return item.value === val
      })
      if (type) {
        result = type.label
      }
      return result
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getDevices()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },

    /**
     * 获取设备列表
     * @author shengzhi
     */
    getDevices (reset) {
      if (this.queryType.value === 'id') {
        if (this.query - 0 > 2100000000) {
          this.showNotice({
            type: 'error',
            content: '设备ID不可超过2100000000'
          })
          return
        }
      }
      if (reset === true) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
        // 初次请求，设备数量就是已使用配额
        if (this.firstRequest) {
          this.used = res.data.count
        }
        this.loadingData = false
        this.firstRequest = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 搜索
     * @author shengzhi
     */
    handleSearch (val) {
      this.query = val
      if (this.query.length === 0) {
        this.getDevices(true)
      }
    },

    /**
     * 排序
     * @author shengzhi
     */
    sortBy (key) {
      if (typeof key === 'object') {
        key = key.key
      }
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc'
      this.getDevices()
    },

    /**
     * 切换搜索
     * @author shengzhi
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     * @author shengzhi
     */
    cancelSearching () {
      this.getDevices()
    },

    /**
     * 发布产品
     * @author shengzhi
     */
    releaseProduct () {
      if (window.confirm('已发布的产品将不允许被删除，确认发布？')) {
        let editModel = _.cloneDeep(this.currentProduct)
        editModel.is_release = true
        api.product.updateProduct(editModel).then((res) => {
          api.product.getProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.updateProduct(res.data)
              this.showNotice({
                type: 'success',
                content: '产品发布成功'
              })
            }
          })
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
        })
      }
    },

    /**
     * 编辑产品
     * @author shengzhi
     */
    editProduct () {
      this.$route.router.go({path: 'edit', append: true})
    },

    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getDevices(true)
      }
    },

    /**
     * 时间范围改变
     * @param  {[type]} startDate [description]
     * @param  {[type]} endDate   [description]
     * @return {[type]}           [description]
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getDevices(true)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.annuls-chart
  position relative

.quota
  position absolute
  width 100px
  top 85px
  left 50%
  margin-left -50px
  text-align center
  color #999

.quota-tit
  font-size 10px
  margin 5px 0

.quota-sum
  font-size 20px
  margin 5px 0
  color black

.product-info
  position relative

  .actions
    absolute right top 10px

    .btn
      vertical-align middle

    .released
      display inline-block
      border 1px solid #BBB
      height 26px
      line-height 26px
      padding 0 15px
      color green
      vertical-align middle
      font-size 12px

.product-name
  margin 0px 10px 5px 0px
  font-size 18px
  i
    margin-left 5px

.buy-access
  text-align center
  margin-top -10px
  button
    width 140px
    border-radius 3px
.buy-record
  text-align center
  margin-top 3px
  color #999999

.product-key
  font-size 20px

.qrcode
  font-size 16px
  word-wrap break-word
.tips-box
  border 1px solid light-border-color
  font-size 11px
  height 125px
  overflow-y auto

  .tips-box-item
    line-height 20px
    padding 2px 5px
</style>
