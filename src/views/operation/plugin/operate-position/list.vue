<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>运营位管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button class="btn btn-primary" @click="showAddModal"><i class="fa fa-plus"></i>添加运营位 </button>
          </div>
        </div>
        <x-table :headers="columns" :tables="operationPositoinList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-name="onNameClick" @tbody-operation="showEditModal" :simple-page="true"></x-table>
      </div>

      <modal :show.sync="modal.show" @close="onSubmitCancel">
        <h3 slot="header">{{ modalTitle }}</h3>
        <div slot="body" class="form">
          <validator name="validation">
            <form novalidate @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-6">名称：</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'请输入运营位名称'">
                    <input type="text" class="input-text" v-model="modal.operationPostion.name" name="modal.operationPostion.name" v-validate:name="{required: true, minlength: 1, maxlength: 20, format: 'no-spaces-both-ends'}">
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: '名称'}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', ['名称', 20]) }}</span>
                    <span v-if="$validation.name.touched && $validation.name.format">名称不允许前后带空格</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">运营图片：</label>
                <div class="picture col-18">
                  <div class="control-text">
                    <span>为运营位指定一个展示图片（单位：像素）</span>
                  </div>
                  <div class="row">
                    <label class="form-control col-2">宽：</label>
                    <div class="controls col-8">
                      <div class="input-text-wrap">
                        <input type="text" class="input-text" v-model="modal.operationPostion.width" name="modal.operationPostion.width" v-validate:width="{required: true, format: 'integer'}">
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.width.touched && $validation.width.required">宽为必填项</span>
                        <span v-if="$validation.width.modified && $validation.width.format">宽必须为正整数</span>
                      </div>
                    </div>
                    <label class="form-control col-2 col-offset-4">高：</label>
                    <div class="controls col-8">
                      <div class="input-text-wrap">
                        <input type="text" class="input-text" v-model="modal.operationPostion.height" name="modal.operationPostion.height" v-validate:height="{required: true, format: 'integer'}">
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.height.touched && $validation.height.required">高为必填项</span>
                        <span v-if="$validation.height.modified && $validation.height.format">高必须为正整数</span>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="value-box row">
                    <div class="width col-12 row">
                      <label class="col-5 control-text">宽：</label>
                      <div class="input-text-wrap col-15">
                        <input type="text" class="input-text" v-model="modal.operationPostion.width" name="modal.operationPostion.width" v-validate:width="{required: true, format: 'integer'}">
                      </div>
                      <div class="form-tips form-tips-error col-20">
                        <span v-if="$validation.width.touched && $validation.width.required">宽为必填项</span>
                        <span v-if="$validation.width.modified && $validation.width.format">宽必须为正整数</span>
                      </div>
                    </div>
                    <div class="height col-12 row">
                      <label class="col-5 control-text">高：</label>
                      <div class="input-text-wrap col-15">
                        <input type="text" class="input-text" v-model="modal.operationPostion.height" name="modal.operationPostion.height" v-validate:height="{required: true, format: 'integer'}">
                      </div>
                      <div class="form-tips form-tips-error col-20">
                        <span v-if="$validation.height.touched && $validation.height.required">高为必填项</span>
                        <span v-if="$validation.height.modified && $validation.height.format">高必须为正整数</span>
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
              <div class="form-actions">
                <label class="del-check" v-show="modal.type==='edit'">
                  <input type="checkbox" name="del" v-model="modal.delChecked"/>{{ '删除运营位' }}
                </label>
                <button type="submit" :disabled="modal.submitting" :class="{'disabled':modal.submitting}" v-text="modal.submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
                <button type="reset" @click.prevent.stop="onSubmitCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              </div>
            </form>
          </validator>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import Modal from 'components/Modal'
import Table from 'components/Table'
import * as config from 'consts/config'

export default {
  name: 'OperationPostion', // 运营管理-运营位

  mixins: [globalMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    Modal,
    'x-table': Table
  },

  data () {
    return {
      columns: [{
        key: 'name',
        title: '名称'
      }, {
        key: 'size',
        title: '图片规格（宽*高）',
        class: 'wp30'
      }, {
        key: 'operation',
        title: '操作',
        class: 'wp20'
      }],
      modal: {
        show: false,
        type: 'edit',
        delChecked: false,
        submitting: false,
        operationPostion: {
          name: '',
          width: '',
          height: ''
        }
      },
      operationPostions: [],
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingData: false
    }
  },

  computed: {
    // 查询条件
    queryCondition () {
      let condition = {
        filter: ['_id', 'name', 'width', 'height'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {'create_time': -1},
        query: {}
      }

      return condition
    },

    // 浮层标题
    modalTitle () {
      var result = {
        'add': '添加运营位',
        'edit': '编辑运营位'
      }
      return result[this.modal.type]
    },

    // 运营位列表
    operationPositoinList () {
      let result = []
      this.operationPostions.forEach((item) => {
        result.push({
          name: `<a class="hl-red">${item.name}</a>`,
          size: `${item.width} * ${item.height}`,
          operation: '<a class="hl-red">编辑</a>',
          origin: item
        })
      })
      return result
    },

    // 分页信息
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
      this.getOperatePositions()
    }
  },

  methods: {
    /**
     * 处理名称点击
     * @author shengzhi
     * @params {Object} operationPostion 目标运营位
     */
    onNameClick (operationPostion) {
      this.$route.router.go({'path': 'stall/' + operationPostion.origin._id, append: true})
    },

    /**
     * 处理每页数量更新
     * @author shengzhi
     * @param {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
    },

    /**
     * 处理页码更新
     * @author shengzhi
     * @param {Number} page 页码
     */
    onCurrentPageChange (page) {
      this.currentPage = page
      this.getOperatePositions()
    },

    /**
     * 获取运营位列表
     * @return {[type]} [description]
     */
    getOperatePositions () {
      this.loadingData = true
      this.appID = this.$route.params.app_id
      this.token = JSON.parse(window.localStorage.pluginsToken)[this.appID].token
      api.operate.getOperatePositions(this.appID, this.token, this.queryCondition).then((res) => {
        console.log(res.data.list)
        this.operationPostions = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((err) => {
        // this.handleError(err)
        console.log(err)
        this.loadingData = false
      })
    },

    /**
     * 显示添加运营位浮层
     * @return {[type]} [description]
     */
    showAddModal () {
      this.modal.type = 'add'
      this.modal.show = true
    },

    /**
     * 显示编辑运营位浮层
     * @param  {[type]} operationPostion [description]
     * @return {[type]}       [description]
     */
    showEditModal (operationPostion) {
      this.modal.type = 'edit'
      this.modal.operationPostion = {
        _id: operationPostion.origin._id,
        name: operationPostion.origin.name,
        width: operationPostion.origin.width,
        height: operationPostion.origin.height
      }
      this.modal.show = true
    },

    /**
     * 表单提交
     * @return {[type]} [description]
     */
    onSubmit () {
      if (this.modal.submitting) return

      let process

      if (this.modal.delChecked) { // 删除运营位
        if (!window.confirm('您确定要删除该运营位？')) return
        process = api.operate.delOperatePosition(this.appID, this.token, this.modal.operationPostion._id)
      } else {
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
        let params = this.modal.operationPostion

        if (this.modal.type === 'add') { // 添加运营位
          params.content = []
          params.creator = this.currentMember.name
          process = api.operate.addOperatePosition(this.appID, this.token, params)
        } else { // 编辑运营位
          process = api.operate.updateOperatePosition(this.appID, this.token, params, this.modal.operationPostion._id)
        }
      }

      this.modal.submitting = true
      process.then((res) => {
        // console.log(res)
        this.getOperatePositions()
        this.onSubmitCancel()
      }).catch((err) => {
        this.handleError(err)
        this.modal.submitting = false
      })
    },

    /**
     * 关闭浮层
     * @return {[type]} [description]
     */
    onSubmitCancel () {
      this.$resetValidation()
      this.modal.show = false
      this.modal.submitting = false
      this.modal.delChecked = false
      this.modal.operationPostion = {
        name: '',
        width: '',
        height: ''
      }
    }
  }
}
</script>
