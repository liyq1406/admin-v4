<template>
  <div class="panel major-client-devices">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select :label="selectedProduct.name" width='110px' size="small">
                <span slot="label">{{ $t('common.display') }}</span>
                <select v-model="selectedProduct" @change="getDevices">
                  <option v-for="product in products" :value="product">{{product.name}}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">

            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" @cancel="getDevices" :placeholder="$t('common.placeholder.search')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices">
                <button slot="search-button" @click="getDevices" class="btn"><i class="fa fa-search"></i></button>
                <!-- <label>{{ $t('ui.user.search_user') }}</label> -->
              </search-box>
            </div>

            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm" @click="showBatchModal">
                <i class="fa fa-reply-all"></i>
                批量导入
              </button>
            </div>

          </div>
        </div>
        <x-table
        :headers="headers"
        :rows="rows"
        :page="page"
        :loading="loadingData"
        @theader-is-active="sortBySomeKey"
        @theader-active-date="sortBySomeKey"
        @theader-is-online="sortBySomeKey"
        @page-count-update="pageCountUpdate"
        @current-page-change="currentPageChange"
        ></x-table>
      </div>
    </div>

    <!-- 批量导入浮层 -->
    <modal :show.sync="isShowBatchModal" @close="onBatchCancel">
      <h3 slot="header">关联设备</h3>
      <div slot="body" class="form">
        <form autocomplete="off" @submit.prevent="">
          <!-- 选择产品 -->
          <div class="form-row row">
            <label class="form-control col-4">选择产品:</label>
            <div class="controls col-20">
              <x-select :label="importingProduct.name" size="small">
                <!-- <span slot="label">{{ $t('common.display') }}</span> -->
                <select v-model="importingProduct" @change="getDevices">
                  <option v-for="product in products" :value="product">{{product.name}}</option>
                </select>
              </x-select>
            </div>
          </div>

          <!-- 功能按钮 -->
          <div class="form-row row">
            <label class="form-control col-4">导入方式:</label>
            <div class="controls col-20">
              <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
                <input type="file" v-el:mac-file name="macFile" @change.prevent="selectFile"/>
                <i class="fa fa-reply-all"></i> 导入文件关联
              </label>
              <span class="import-btn-tips-span">推荐</span>
              <span class="file-name">{{ file.name }}</span>
              <p class="hl-gray"><i class="fa fa-exclamation-triangle hl-orange"></i> 仅限csv格式文件,每次只能上传一个产品设备,切勿传错产品</p>

              <label>
                <button class="btn btn-ghost btn-upload" @click.prevent="goSelectDeviceView">
                  <i class="fa fa-reply-all"></i> 选择列表设备
                </button>
              </label>
            </div>
          </div>
          <!-- 功能按钮 -->
          <!-- <div class="form-row row mt30 bordered" >
            <label>
              <button class="btn btn-ghost btn-upload" @click.prevent="goSelectDeviceView">
                <i class="fa fa-reply-all"></i> 选择列表设备
              </button>
            </label>
          </div> -->

          <div class="form-actions">
            <button @click.prevent.stop="batchImport" :disabled="importing" :class="{'disabled':importing}" v-text="importing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onBatchCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
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
        <div class="row" v-if="tips.macArr || tips.snArr">
          <div class="col-11">
            <div class="tips-tit">重复mac</div>
            <div class="tips-box">
              <div class="tips-box-item" v-for="item in tips.macArr">{{ item.trim() }}</div>
            </div>
          </div>
          <div class="col-11 col-offset-2">
            <div class="tips-tit">重复sn</div>
            <div class="tips-box">
              <div class="tips-box-item" v-for="item in tips.snArr">{{ item.trim() }}</div>
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
import api from 'api'
import formatDate from 'filters/format-date'
export default {
  name: 'device-list',
  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
  },

  data () {
    return {
      searching: false,
      query: '',
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      file: {},
      importing: false,
      isShowBatchModal: false,
      selectedProduct: {},
      importingProduct: {},
      // 提示浮层
      isShowTipsModal: false,
      tips: {},

      devices: [ // 用户绑定设备列表
        // {
        //   'id': '设备ID',
        //   'mac': 'MAC地址',
        //   'name': '设备名称',
        //   'is_active': false,
        //   'active_date': '2014-10-09T08:15:40.843Z',
        //   'is_online': false,
        //   'last_login': '最近登录时间',
        //   'last_login_ip': '最近登录IP',
        //   'mcu_mod': 'MCU型号',
        //   'mcu_version': 'MCU版本号',
        //   'firmware_mod': '固件型号',
        //   'firmware': '固件版本号',
        //   'product_id': '产品ID',
        //   'region_id': '所在区域ID',
        //   'sn': '设备序列号',
        //   'create_time': '创建时间',
        //   'creator_id': '创建者ID',
        //   'creator_type': '创建者类型',
        //   'heavy_buyer': '大客户Id'
        // }
      ],
      headers: [
        // {
        //   key: 'name',
        //   title: '产品名称（型号）'
        // },
        {
          key: 'mac',
          title: 'MAC'
        },
        {
          key: 'sn',
          title: this.$t('operation.user.details.devices.sn')
          // tooltip: '提示内容'
        },
        {
          key: 'is_active',
          title: this.$t('operation.user.details.devices.is_active'),
          sortType: '-1'
        },
        {
          key: 'active_date',
          title: this.$t('operation.user.details.devices.active_date'),
          sortType: '-1'
        },
        {
          key: 'is_online',
          title: this.$t('operation.user.details.devices.is_online'),
          class: 'tac',
          sortType: '-1'
        }
      ],
      // 当前用于排序的字段 默认是激活时间
      sortKey: 'active_date'
    }
  },

  computed: {
    /**
     * 传入智能表格的分页对象
     * 国辉
     * @return {[type]} [description]
     */
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 传入智能表格的数据对象
     * 国辉
     * @return {[type]} [description]
     */
    rows () {
      var result = []
      this.devices.map((device) => {
        var table = {
          // name: device.name,
          mac: device.mac,
          sn: device.sn,
          is_active: device.is_active ? this.$t('common.yes') : this.$t('common.no'),
          active_date: formatDate(device.active_date),
          is_online: device.is_online ? this.$t('common.online') : this.$t('common.offline'),
          prototype: device
        }
        result.push(table)
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: [
          'id',
          'mac',
          'name',
          'is_active',
          'active_date',
          'is_online',
          'last_login',
          'last_login_ip',
          'mcu_mod',
          'mcu_version',
          'firmware_mod',
          'firmware',
          'product_id',
          'region_id',
          'sn',
          'create_time',
          'creator_id',
          'creator_type',
          'heavy_buyer'
        ],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          'heavy_buyer': { $in: [this.$route.params.id] }
        }
      }

      if (this.query.length > 0) {
        condition.query['name'] = { $like: this.query }
        condition.query['mac'] = { $like: this.query }
        condition.query['sn'] = { $like: this.query }
      }

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    }
  },

  watch: {
    products () {
      this.init()
    }
  },

  route: {
    data () {
      this.init()
    }
  },

  methods: {
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
            macArr = macArr.slice(1).map((item) => {
              let macObj = item.split(',')
              let result = {
                mac: macObj[0] ? macObj[0].trim() : ''
              }
              if (macObj[1] && macObj[1].trim()) result.sn = macObj[1].trim()
              if (macObj[2] && macObj[2].trim()) result.name = macObj[2].trim()
              return result
            })
            console.log(macArr)
            api.heavyBuyer.grantDevices(this.$route.params.id, this.importingProduct.id, macArr).then((res) => {
              if (res.status === 200) {
                // this.showNotice({
                //   type: 'success',
                //   content: this.$t('common.upload.success_msg')
                // })
                this.getDevices()
                this.onBatchCancel()
                this.tips = {
                  type: 'import-success',
                  recordId: res.data.import_record_id
                }
                this.isShowTipsModal = true
              }
              this.importing = false
            }).catch((res) => {
              this.onBatchCancel()
              this.handleImportError(res)
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
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    showBatchModal () {
      this.isShowBatchModal = true
      this.importingProduct = _.clone(this.selectedProduct)
    },

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
     * 当前页码改变
     * 国辉
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    currentPageChange (number) {
      this.currentPage = number
      this.getDevices()
    },
    /**
     * 每页显示的数量改变
     * 国辉
     * @param  {[type]} count 每页显示数量
     * @return {[type]}       [description]
     */
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },
    /**
     * 获取用户订阅设备
     */
    getDevices () {
      this.loadingData = true
      api.product.getDevices(this.selectedProduct.id, this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.devices = res.data.list
          this.total = res.data.count
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDevices()
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      this.sortKey = header.key
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getDevices()
    },
    /**
     * 初始化产品 下拉列表
     * @return {[type]} [description]
     */
    init () {
      this.selectedProduct = this.products[0] || {}
      if (this.selectedProduct.id) {
        this.getDevices()
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
     * 处理导入错误
     * @author shengzhi
     * @params {Object} res 响应信息
     */
    handleImportError (res) {
      let code = res.data.error.code
      const ERRORS = {
        '4001001': {
          type: 'error',
          msg: 'MAC地址不合法'
        },
        '4041033': {
          type: 'error',
          msg: '导入失败，产品配额不足'
        },
        '4001021': {
          type: 'error-duplicated-data',
          msg: '导入失败，导入设备信息与数据库存在重复项，请检查数据'
        },
        '4001147': {
          type: 'error-duplicated-items',
          msg: '导入数据中存在重复项，请检查数据是否唯一'
        }
      }

      if (ERRORS.hasOwnProperty(code)) {
        this.isShowTipsModal = true
        let tips = ERRORS[code]
        let msg = res.data.error.msg.split('],[')

        if (msg.length > 1) {
          tips.macArr = msg[0].replace('[', '').split(',')
          tips.snArr = msg[1].replace(']', '').split(',')
        }
        this.tips = tips
      } else {
        this.handleError(res)
      }
    },

    /**
     * 进入设备选择页面
     */
    goSelectDeviceView () {
      this.onBatchCancel()
      setTimeout(() => {
        this.$route.router.go(`/operation/major-clients/${this.$route.params.id}/import-device`)
      }, 50)
    }
  }
}
</script>

<style lang="stylus">

  .major-client-devices
    .import-btn-tips-span
      color #2bc52b
      position relative
      top -3px
</style>
