<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>授权记录</h2>
    </div>
    <div class="row statistic-group">
      <div class="col-8">
        <statistic :total="currentProduct.quota" title="授权额度" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :total="used" title="已使用" :has-target="true" align="left">
        </statistic>
      </div>
      <div class="col-8">
        <statistic :total="remain" title="剩余额度" :has-action="true" align="left" :showchange="true" :animated="false">
          <div slot="action" class="hidden">
            <button class="btn btn-ghost btn-sm">购买配额</button>
          </div>
        </statistic>
      </div>
    </div>
    <div class="panel mt15">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <span slot="label">明细：</span>
                <button @click="showAddModal" class="btn btn-ghost btn-sm">手动添加</button>
                <button class="btn btn-ghost btn-sm" @click="showBatchModal">
                <i class="fa fa-reply-all"></i>
                批量导入</button>
                <!-- <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
                  <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>批量导入
                </label> -->
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :placeholder="'请输入添加人'" :active="searching" @cancel="getRecords(true)" @search-activate="searching=!searching"  @press-enter="getRecords(true)">
                  <!-- <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select> -->
                  <button slot="search-button" @click="getRecords(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="columns" :tables="recordList" :page="page" :loading="loadingData" @tbody-operate="viewInfo"  @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>

    <!-- 手动添加浮层 -->
    <modal :show.sync="isShowAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t("ui.overview.add_device") }}</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.overview.addForm.mac") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.overview.addForm.mac_placeholder')" class="input-text-wrap required-sign">
                  <input v-model="addModel.mac" type="text" name="addModel.mac" v-validate:mac="{required: true, minlength: 2, maxlength: 64, format: 'mac'}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.mac.touched && $validation.mac.required">{{ $t('common.validation.required', {field: 'MAC'}) }}</span>
                  <span v-if="$validation.mac.touched && $validation.mac.modified && $validation.mac.format">MAC应为十六进制字符的组合</span>
                  <span v-if="$validation.mac.touched && $validation.mac.modified && $validation.mac.minlength">{{ $t('common.validation.minlength', ['MAC', 2]) }}</span>
                  <span v-if="$validation.mac.touched && $validation.mac.modified && $validation.mac.maxlength">{{ $t('common.validation.maxlength', ['MAC', 64]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">序列号:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入序列号'" class="input-text-wrap">
                  <input v-model="addModel.sn" type="text" name="addModel.sn" v-validate:sn="{format: 'sn', maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.sn.modified && $validation.sn.format">序列号只能包含数字、英文字母和中划线，且不以中划线开头</span>
                  <span v-if="$validation.sn.touched && $validation.sn.modified && $validation.sn.maxlength">{{ $t('common.validation.maxlength', ['序列号', 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">名字:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入名字'" class="input-text-wrap">
                  <input v-model="addModel.name" type="text" name="addModel.name" v-validate:name="{format: 'trim'}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.modified && $validation.name.format">名字不允许前后带空格</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>

    <!-- 批量导入浮层 -->
    <modal :show.sync="isShowBatchModal" @close="onBatchCancel">
      <h3 slot="header">导入设备</h3>
      <div slot="body" class="form">
        <form autocomplete="off" @submit.prevent="">
          <div class="form-row row">
            <!-- <label class="form-control col-6">导入:</label> -->
            <p>您可以通过标准设备列表文件批量导入设备，<a href="/static/files/import_template.csv" class="hl-red">查看示例</a></p>
            <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
              <input type="file" v-el:mac-file name="macFile" @change.prevent="selectFile"/><i class="fa fa-reply-all"></i> 批量导入
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

    <!-- 提示浮层 -->
    <modal :show.sync="isShowTipsModal" @close="onTipsCancel">
      <h3 slot="header">提示</h3>
      <div slot="body">
        <alert type="success" title="" :cols="22" v-if="tips.type==='import-success'">
          <p>设备导入成功，<a v-link="{path: 'info/list/' + tips.recordId}" class="hl-red">查看导入记录</a></p>
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
// import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
// import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import Table from 'components/Table'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import Statistic from 'components/Statistic2'
import Alert from 'components/Alert'
import formatDate from 'filters/format-date'

export default {
  name: 'Authorize',

  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    'x-table': Table,
    Pager,
    Breadcrumb,
    Statistic,
    SearchBox,
    Alert
  },

  data () {
    return {
      isShowAddModal: false,
      isShowBatchModal: false,
      queryTypeOptions: [
        { label: '添加人', value: 'auth_member' }
      ],
      loadingData: false,
      originAddModel: {
        mac: '',
        sn: '',
        name: ''
      },
      addModel: {},
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
      columns: [{
        key: 'time',
        title: '时间'
      }, {
        key: 'warrent',
        title: '授权数'
      }, {
        key: 'addman',
        title: '添加人'
      }, {
        key: 'operate',
        title: '操作'
      }],
      records: [],
      file: {},
      adding: false,
      importing: false,
      isShowTipsModal: false,
      tips: {}
    }
  },

  route: {
    data () {
      this.currentPage = 1
      this.getRecords()
      // 获取产品列表，并将获取的数量作为已用配额
      this.getUsed()
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

    // 剩余配额
    remain () {
      let total = this.currentProduct.quota || 0
      let remain = 0
      if (total > 0 && this.used >= 0) {
        remain = total - this.used
      }
      return remain < 0 ? 0 : remain
    },

    // 授权记录列表
    recordList () {
      var result = []
      this.records.map((item) => {
        let record = {
          time: formatDate(item.create_time),
          warrent: item.auth_number,
          addman: item.auth_member,
          operate: '<button class="btn-link">查看详情</button>',
          prototype: item
        }
        result.push(record)
      })
      return result
    },

    // 查询条件
    queryCondition () {
      var condition = {
        filter: ['_id', 'auth_number', 'auth_member', 'create_time', 'product_id'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    }
  },

  methods: {
    /**
     * 获取已用配额
     */
    getUsed () {
      let condition = {
        limit: 1,
        offset: 0
      }
      api.device.getList(this.$route.params.id, condition).then((res) => {
        this.used = res.data.count
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 查看详情
     * @author shengzhi
     * @param {Object} record 记录
     */
    viewInfo (record) {
      this.$route.router.go({path: 'info/list/' + record.prototype._id})
    },

    /**
     * 查询导入设备历史纪录
     * @author shengzhi
     * @param {Boolean} reset 是否重置页码
     */
    getRecords (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.product.getRecords(this.$route.params.id, this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.records = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    showAddModal () {
      this.addModel = _.clone(this.originAddModel)
      this.isShowAddModal = true
    },

    // 关闭添加浮层并净化添加表单
    onAddCancel () {
      this.adding = false
      this.isShowAddModal = false
      this.$resetValidation()
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

    // 添加操作
    onAddSubmit () {
      if (this.adding) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      this.adding = true
      let device = {
        mac: this.addModel.mac
      }
      if (this.addModel.name) device.name = this.addModel.name
      if (this.addModel.sn) device.sn = this.addModel.sn
      api.product.importDevices(this.$route.params.id, [device]).then((res) => {
        if (res.status === 200) {
          // this.showNotice({
          //   type: 'success',
          //   content: '添加成功'
          // })
          this.getUsed()
          this.onAddCancel()
          this.getRecords()
          this.isShowTipsModal = true
          this.tips = {
            type: 'import-success',
            recordId: res.data.import_record_id
          }
        }
      }).catch((res) => {
        this.handleImportError(res)
        this.adding = false
      })
    },

    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getRecords()
    },

    /**
     * 选择文件
     */
    selectFile () {
      this.file = this.$els.macFile.files[0]
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
            api.product.importDevices(this.$route.params.id, macArr).then((res) => {
              if (res.status === 200) {
                // this.showNotice({
                //   type: 'success',
                //   content: this.$t('common.upload.success_msg')
                // })
                this.getUsed()
                this.getRecords()
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
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getRecords()
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
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    showBatchModal () {
      this.isShowBatchModal = true
    },

    /**
     * 关闭提示浮层
     */
    onTipsCancel () {
      this.isShowTipsModal = false
      this.tips = {}
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

.btn-upload
  vertical-align middle

.file-name
  display inline-block
  margin-left 10px
  line-height 28px
  vertical-align middle

.tips-box
  border 1px solid light-border-color
  font-size 11px
  height 125px
  overflow-y auto

  .tips-box-item
    line-height 20px
    padding 2px 5px
</style>
