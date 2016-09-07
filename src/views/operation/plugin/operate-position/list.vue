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
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>名称</th>
                <th class="w180">图片规格（宽*高）</th>
                <th class="w80 tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="operationPostions.length > 0">
                <tr v-for="operationPostion in operationPostions">
                  <td>
                    <a class="hl-red" v-link="{'path': 'stall/' + operationPostion._id, append: true}">
                      {{ operationPostion.name }}
                    </a>
                  </td>
                  <td>{{ operationPostion.width }}*{{ operationPostion.height }}</td>
                  <td class="tac">
                    <a class="hl-red" @click="showEditModal(operationPostion)">
                      编辑
                    </a>
                  </td>
                </tr>
              </template>
              <tr v-if="total === 0">
                <td colspan="3" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getOperatePositions"></pager>
      </div>

      <modal :show.sync="modal.show" @close="closeModal">
        <h3 slot="header">{{ modalTitle }}</h3>
        <div slot="body" class="form">
          <validator name="validation">
            <form novalidate @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-6">名称：</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'请输入运营位名称'">
                    <input type="text" class="input-text" v-model="modal.operationPostion.name" name="modal.operationPostion.name" v-validate:name="{required: true}">
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">名称为必填项</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">运营图片：</label>
                <div class="picture col-18">
                  <div class="control-text">
                    <span>为运营位指定一个展示图片（单位：像素）</span>
                  </div>
                  <div class="value-box row">
                    <div class="width col-12 row">
                      <label class="col-5 control-text">宽：</label>
                      <div class="input-text-wrap col-10">
                        <input type="text" class="input-text" v-model="modal.operationPostion.width" name="modal.operationPostion.width" v-validate:width="{required: true}">
                      </div>
                      <div class="form-tips form-tips-error col-10">
                        <span v-if="$validation.width.touched && $validation.width.required">宽为必填项</span>
                      </div>
                    </div>
                    <div class="height col-12 row">
                      <label class="col-5 control-text">高：</label>
                      <div class="input-text-wrap col-10">
                        <input type="text" class="input-text" v-model="modal.operationPostion.height" name="modal.operationPostion.height" v-validate:height="{required: true}">
                      </div>
                      <div class="form-tips form-tips-error col-10">
                        <span v-if="$validation.height.touched && $validation.height.required">高为必填项</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <label class="del-check" v-show="modal.type==='edit'">
                  <input type="checkbox" name="del" v-model="modal.delChecked"/>{{ '删除运营位' }}
                </label>
                <button type="submit" :disabled="modal.editing" :class="{'disabled':modal.editing}" v-text="modal.editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
                <button type="reset" @click.prevent.stop="closeModal" class="btn btn-default">{{ $t("common.cancel") }}</button>
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
  // import { setCurrentMember } from './store/actions/system'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import * as config from 'consts/config'
  export default {
    name: 'operate-operationPostion', // 运营管理-运营位

    layout: 'admin',

    mixins: [globalMixins],

    vuex: {
      getters: {
        currentMember: ({ system }) => system.currentMember
      }
    },

    components: {
      'modal': Modal,
      // 'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        validation: {},
        modal: {
          show: false,
          type: 'edit',
          delChecked: false,
          editing: false,
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
      }
    },

    route: {
      data () {
        this.getOperatePositions()
      }
    },

    methods: {
      /**
       * 获取运营位列表
       * @return {[type]} [description]
       */
      getOperatePositions () {
        this.loadingData = true
        this.appID = this.$route.params.app_id
        this.token = JSON.parse(window.localStorage.pluginsToken)[this.appID].token
        api.operate.getOperatePosition(this.appID, this.token, this.queryCondition).then((res) => {
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
       * 添加运营位
       * @return {[type]} [description]
       */
      addStall () {
        if (this.$validation.valid) {
          var params = this.modal.operationPostion
          params.content = []
          params.creator = this.currentMember.name
          params.create_time = (new Date()).toISOString()
          api.operate.addOperatePosition(this.appID, this.token, params).then((res) => {
            this.getOperatePositions()
            this.closeModal()
          }).catch((err) => {
            this.handleError(err)
            this.modal.editing = false
          })
        } else {
          console.warn('参数验证不通过:' + JSON.stringify(this.modal.operationPostion))
          this.modal.editing = false
        }
      },

      /**
       * 更新运营位
       * @return {[type]} [description]
       */
      updateStall () {
        if (this.$validation.valid) {
          var params = this.modal.operationPostion
          params.content = []
          api.operate.updateOperatePosition(this.appID, this.token, params, this.modal.operationPostion._id).then((res) => {
            // console.log(res)
            this.getOperatePositions()
            this.closeModal()
          }).catch((err) => {
            this.handleError(err)
            this.modal.editing = false
          })
        } else {
          console.warn('参数验证不通过：' + JSON.stringify(this.modal.operationPostion))
        }
      },

      /**
       * 删除运营位
       * @return {[type]} [description]
       */
      deleteStall () {
        console.log('删除运营位')
        console.log(this.modal.operationPostion)
        api.operate.delOperatePosition(this.appID, this.token, this.modal.operationPostion._id).then((res) => {
          // console.log(res)
          this.getOperatePositions()
          this.closeModal()
        }).catch((err) => {
          this.handleError(err)
          this.modal.editing = false
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
          _id: operationPostion._id,
          name: operationPostion.name,
          width: operationPostion.width,
          height: operationPostion.height
        }
        this.modal.show = true
      },
      /**
       * 表单提交
       * @return {[type]} [description]
       */
      onSubmit () {
        this.modal.editing = true
        if (this.modal.type === 'add') { // 添加运营位
          this.addStall()
        } else { // 编辑运营位
          if (this.modal.delChecked) { // 删除运营位
            this.deleteStall()
          } else { // 编辑运营位
            this.updateStall()
          }
        }
      },

      /**
       * 关闭浮层
       * @return {[type]} [description]
       */
      closeModal () {
        this.$resetValidation()
        this.modal.show = false
        this.modal.editing = false
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
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .operate-stall
    .form
      .picture
        height 74px
        line-height 32px
        .tips
          height 32px
          margin-bottom 10px
      .form-actions
        margin-top 40px

    .panel-hd
      padding-bottom 10px
      .actions .btn
        height 32px
        line-height 32px

</style>
