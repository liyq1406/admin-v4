<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>标签管理</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="addTag" class="btn btn-primary"><i class="fa fa-plus"></i>添加标签</button>
          </div>
        </div>
        <x-table :headers="columns" :tables="tagList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-operation="editTag" :simple-page="true">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" placeholder="请输入关键字" @cancel="getTags(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getTags(true)">
                  <button slot="search-button" @click="getTags(true)" class="btn">{{ $t('common.search') }}</button>
                </search-box>
              </div>
            </div>
            <h3>标签列表</h3>
          </div>
        </x-table>
      </div>
    </div>

    <!-- 添加/修改标签浮层-->
    <modal :show.sync="modal.isShow" width="480px" @close="onCancel">
      <h3 slot="header">{{ modalTitle }}</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form novalidate @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">名称:</label>
              <div class="controls col-18">
                <div class="input-text-wrap required-sign" v-placeholder="'请输入1-20字符'">
                  <input v-model="model.label" name="model.label" type="text" v-validate:label="{required: true, maxlength: 20, format: 'trim'}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.label.touched && $validation.label.required">请输入名称</span>
                  <span v-if="$validation.label.modified && $validation.label.maxlength">{{ $t('common.validation.maxlength', [$t('ui.recipe.fields.name'), 20]) }}</span>
                  <span v-if="$validation.label.touched && $validation.label.format">名称不允许前后带空格</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <label v-if="modal.type === 'edit'" class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除此标签
              </label>
              <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="submiting" :class="{'disabled':submiting}" v-text="submiting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
// import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'

export default {
  name: 'TagList',

  mixins: [globalMixins, pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
  },

  data () {
    return {
      columns: [{
        key: 'label',
        title: '名称'
      }, {
        key: 'operation',
        title: '操作',
        class: 'wp20'
      }],
      key: '',
      loadingData: false,
      tags: [],
      total: 0,
      countPerPage: 10,
      currentPage: 1,
      modal: {
        isShow: false,
        type: 'add'
      },
      addModel: {
        name: ''
      },
      model: {},
      query: '',
      delChecked: false,
      searching: false
    }
  },

  computed: {
    // 表单标题
    modalTitle () {
      let title = ['标签']

      title.unshift(({
        add: '添加',
        edit: '编辑'
      })[this.modal.type])

      return title.join('')
    },

    // 标签列表
    tagList () {
      let result = []
      this.tags.forEach((item) => {
        result.push({
          label: item.label,
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
    },

    // 标签查询条件
    queryCondition () {
      var condition = {
        filter: ['label'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: -1
        }
      }

      if (this.query.length > 0) {
        condition.query['label'] = {$regex: this.query, $options: 'i'}
      }

      return condition
    }
  },

  route: {
    data () {
      this.getTags()
    }
  },

  methods: {
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
      this.getTags()
    },

    /**
     * 获取标签列表
     */
    getTags (reset) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.content.getTags(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: 'fasfwefe',
          //   name: '下午茶'
          // }, {
          //   _id: 'asdasdfasda',
          //   name: '美食'
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------

          // 标签列表
          this.tags = res.data.list
          // 记录数
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 添加标签
     * @author shengzhi
     */
    addTag () {
      this.modal = {
        isShow: true,
        type: 'add'
      }
      this.model = _.clone(this.addModel)
    },

    /**
     * 添加标签
     * @author shengzhi
     * @param {Object} tag 标签
     */
    editTag (tag) {
      this.modal = {
        isShow: true,
        type: 'edit'
      }
      this.model = _.clone(tag.origin)
    },

    /**
     * 取消表单提交
     * @author shengzhi
     */
    onCancel () {
      this.modal.isShow = false
      this.submiting = false
      this.delChecked = false
      this.$resetValidation()
    },

    /**
     * 处理表单提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submiting) {
        return
      }

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      this.submiting = true
      let params = {
        label: this.model.label
      }
      let process

      if (this.modal.type === 'add') {
        // 添加
        params.creator = this.currentMember.name
        process = api.content.addTag(appId, token, params)
      } else {
        if (this.delChecked) {
          // 删除
          process = api.content.delTag(appId, this.model._id, token)
        } else {
          //  更新
          process = api.content.editTag(appId, this.model._id, token, params)
        }
      }
      process.then((res) => {
        if (res.status === 200) {
          this.getTags()
          this.onCancel()
          this.submiting = false
        }
      }).catch((res) => {
        this.submiting = false
        this.handleError(res)
      })
    },

    /**
     * 搜索
     * @author shengzhi
     */
    handleSearch () {
      if (this.query.length === 0) {
        this.getTags()
      }
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
      this.getTags()
    }
  }
}
</script>
