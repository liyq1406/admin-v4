<template>
  <div class="main">
    <div class="panel mt30">
      <div class="panel-bd ml20 mr20">
        <div class="action-bar">
          <span class="title">授权列表</span>
          <button class="btn btn-primary" @click.stop.prevent="addKey"><i class="fa fa-plus"></i>添加授权</button>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th width="25%">Access Key ID</th>
                <th width="18%" class="tac">Access Key Secret</th>
                <th width="25%">{{ $t("common.name") }}</th>
                <th width="18%">创建时间</th>
                <th width="14%" class="tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="accessKeys.length > 0">
                <tr v-for="accessKey in accessKeys">
                  <td>{{ accessKey.id }}</td>
                  <td class="tac">
                    <button @click="viewAccessKeys(accessKey)" class="btn btn-link btn-mini">{{ $t('common.details') }}</button>
                  </td>
                  <td>{{ accessKey.name }}</td>
                  <td>{{ accessKey.create_time | formatDate }}</td>
                  <td class="tac">
                    <button :class="{'btn-primary': accessKey.status, 'btn-success': !accessKey.status, 'disabled': accessKey.toggling}" :disabled="accessKey.toggling" @click="togglekeys(accessKey)" class="btn btn-primary btn-mini"><i :class="{'fa-stop': accessKey.status, 'fa-play': !accessKey.status}" class="fa"></i>{{ accessKey.status ? $t('ui.task.stop') : $t('ui.task.start') }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="accessKeys.length === 0">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 暂不分页 -->
          <!-- <pager v-if="!loadingData && page.total > countPerPage" :total="page.total" :current="page.currentPage" :count-per-page="page.countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pager> -->
        </div>
      </div>
    </div>

    <!-- 查看 Accesskey 浮层 start -->
    <modal :show.sync="isShowKeyModal">
      <h3 slot="header">Access Key Secret</h3>
      <div slot="body" class="form">
        <div slot="body" class="secret-key tac mb20">{{ key.secret }}</div>
        <div class="form-actions">
          <label class="del-check">
            <input type="checkbox" name="del" v-model="delChecked"/>删除授权
          </label>
          <button @click="onDelConfirm(key.id)" v-text="deleting ? $t('common.handling') : $t('common.ok')" :disabled="deleting" :class="{'disabled':deleting}" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 查看 Accesskey 浮层 end -->

    <!-- 添加授权浮层 start -->
    <modal :show.sync="isShowAddModal" @close="onAddCancel">
      <h3 slot="header">添加授权</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-6">授权名称:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.app.placeholders.name')" class="input-text-wrap">
                  <input v-model="model.name" type="text" name="model.name" v-validate:name="{required: true, minlength: 2, maxlength: 32}"  lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.modified && $validation.name.minlength">{{ $t('common.validation.minlength', [$t('ui.app.fields.name'), 2]) }}</span>
                  <span v-if="$validation.name.touched && $validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('ui.app.fields.name'), 32]) }}</span>
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
    <!-- 添加授权浮层 end -->
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Modal from 'components/Modal'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'Authorize',

  mixins: [globalMixins],

  components: {
    Modal
  },

  data () {
    return {
      loadingData: true,
      accessKeys: [],
      isShowKeyModal: false,
      key: {}, // 当前查看的 key
      delChecked: false,
      deleting: false,
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      adding: false,
      isShowAddModal: false,
      model: {},
      originModel: {
        name: ''
      }
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
    }
  },

  route: {
    data () {
      this.getKeys()
    }
  },

  methods: {
    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getKeys()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getKeys()
    },

    /**
     * 获取 新版的 AccessKey 列表
     * @author shengzhi
     */
    getKeys () {
      this.loadingData = true
      api.empower.getKeys().then((res) => {
        if (res.status === 200) {
          this.accessKeys = res.data.list.map((item) => {
            item.toggling = false
            return item
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 查看密钥
     * @author shengzhi
     * @param  {String} accessKey AccessKey
     */
    viewAccessKeys (accessKey) {
      this.key = accessKey
      this.isShowKeyModal = true
    },

    /**
     * 取消查看授权
     * @author shengzhi
     * @return {void}
     */
    onDelCancel () {
      this.deleting = false
      this.delChecked = false
      this.isShowKeyModal = false
    },

    /**
     * 确定删除授权
     * @author shengzhi
     * @param  {String} id 目标授权id
     * @return {void}
     */
    onDelConfirm (id) {
      if (this.delChecked) {
        this.deleting = true
        api.empower.deleteKeys(id).then((res) => {
          if (res.status === 200) {
            this.getKeys()
            this.onDelCancel()
          }
        }).catch((res) => {
          this.onDelCancel()
          this.handleError(res)
        })
      }
      this.isShowKeyModal = false
    },

    /**
     * 切换状态
     * @author shengzhi
     */
    togglekeys (accessKey) {
      if (!accessKey.toggling) {
        accessKey.toggling = true
        api.empower.toggleKeys(accessKey.id, !accessKey.status - 0).then((res) => {
          if (res.status === 200) {
            accessKey.status = !accessKey.status - 0
            accessKey.toggling = false
          }
        }).catch((res) => {
          this.handleError(res)
          accessKey.toggling = false
        })
      }
    },

    /**
     * 添加授权
     * @author shengzhi
     */
    addKey () {
      this.isShowAddModal = true
      this.model = _.clone(this.originModel)
    },

    /**
     * 关闭添加应用浮层并净化添加表单
     * @author shengzhi
     */
    resetAdd () {
      this.adding = false
      this.isShowAddModal = false
      this.$resetValidation()
    },

    /**
     * 取消添加
     * @author shengzhi
     */
    onAddCancel () {
      this.resetAdd()
    },

    /**
     * 提交添加
     * @author shengzhi
     */
    onAddSubmit () {
      if (this.adding) return
      console.log(this.$validation.invalid)
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }
      this.adding = true
      api.empower.addKeys(this.model).then((res) => {
        if (res.status === 200) {
          this.resetAdd()
          this.getKeys()
        }
      }).catch((res) => {
        this.handleError(res)
        this.adding = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.secret-key
  font-size 20px
.title
  font-size 15px
  padding-right 10px
</style>
