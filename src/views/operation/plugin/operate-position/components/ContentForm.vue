<template>
  <div class="main">
    <div class="main-title">
      <h2>运营位管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="form content-form">
          <div class="form-row row">
            <label class="form-control col-4">内容:</label>
            <div class="controls col-20">
              <a class="hl-red control-text" v-show="selectedContent.name" @click="selectContent">{{ selectedContent.name }}</a>
              <button class="btn btn-ghost w100" v-show="!selectedContent.name" @click="selectContent"><i class="fa fa-plus"></i>选择{{ typeLabel }}</button>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">运营图片:</label>
            <div class="controls col-20">
              <div class="img-box">
                <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
              </div>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-offset-4">
              <button class="btn btn-primary btn-lg" @click="onSubmit">提交</button>
            </div>
          </div>
        </div>
      </div>
      <modal :show.sync="isShowSelectedModal" @close="cancelSelect" :width="'600px'">
        <h3 slot="header">添加{{ typeLabel }}</h3>
        <div slot="body" class="selected-content-box form">
          <form autocomplete="off" @submit.prevent="confirmSelect">
            <div class="form-row row">
              <div class="action-bar">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.ingredient.placeholders.search_condi')" @cancel="getContentList(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getContentList(true)">
                  <button slot="search-button" @click.prevent.stop="getContentList(true)" class="btn">{{ $t('common.search') }}</button>
                </search-box>
              </div>
            </div>
            <div class="form-row row">
              <div class="data-table with-loading">
                <div class="icon-loading" v-show="loadingData">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <table class="table table-stripe table-bordered">
                  <thead>
                    <tr>
                      <th class="tac w40">选择</th>
                      <th>标题</th>
                      <th v-if="$route.params.contentType==='recipes'" class="w60">类型</th>
                      <th class="w100">作者</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="contentList.length > 0">
                      <tr v-for="content in contentList">
                        <td class="tac">
                          <!-- <input type="radio" name="content" @change="selectedContentChange(content)"> -->
                          <input type="radio" name="content" :value="content" v-model="modalSelectedContent">
                        </td>
                        <td>{{ content.name }}</td>
                        <td v-if="$route.params.contentType==='recipes'">{{ content.devices.length ? '智能菜谱' : '普通菜谱' }}</td>
                        <td>{{ content.creator }}</td>
                      </tr>
                    </template>
                    <tr v-if="contentList.length===0">
                      <td :colspan="$route.params.contentType==='recipes' ? 4 : 3" class="tac">
                        <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <pager v-if="total > countPerPage" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onPageUpdate" :simple="true"></pager>
            </div>
            <div class="button-box">
              <div class="form-actions">
                <button @click.prevent.stop="cancelSelect" class="btn btn-default">{{ $t("common.cancel") }}</button>
                <button type="submit" :disabled="selecting" :class="{'disabled':selecting}" v-text="selecting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              </div>
            </div>
          </form>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from 'components/Modal'
import ImageUploader from 'components/ImageUploader'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import Breadcrumb from 'components/Breadcrumb'
import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'ContentForm',

  mixins: [globalMixins],

  components: {
    Pager,
    Modal,
    SearchBox,
    Breadcrumb,
    ImageUploader
  },

  vuex: {
    getters: {
      allPlugins: ({ plugins }) => plugins.all,
      currentMember: ({ system }) => system.currentMember
    }
  },

  props: {
    formType: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      contentAppId: '',
      isShowSelectedModal: false,
      loadingData: false,
      selecting: false,
      query: '',
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      operatePosition: {},
      // 已经选择的内容
      selectedContent: {
        title: ''
      },
      token: '',
      // 图片列表
      images: [''],
      // 浮层上的内容列表
      contentList: [],
      // 浮层上面已经选择的内容
      modalSelectedContent: {}
    }
  },

  computed: {
    // 类型标签
    typeLabel () {
      return ({
        article: '文章',
        recipes: '菜谱',
        menu: '菜单'
      })[this.$route.params.contentType]
    },

    // 面包屑导航
    breadcrumbNav () {
      let result = [{
        label: '运营位管理',
        link: `/operation/plugins/operateposition/${this.$route.params.app_id}`
      }]
      let actionLabel = ({
        add: '添加',
        edit: '编辑'
      })[this.formType]

      if (this.operatePosition.name) {
        result.push({
          label: this.operatePosition.name,
          link: `/operation/plugins/operateposition/${this.$route.params.app_id}/stall/${this.$route.params.id}`
        })
        result.push({
          label: `${actionLabel}内容`
        })
      }

      return result
    },

    // 查询条件
    queryCondition () {
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        // order: {'create_time': 'desc'},
        query: {}
      }

      if (this.query.length > 0) {
        condition.query['name'] = {$regex: this.query, $options: 'i'}
      }

      return condition
    }

    // 应用 Token
    // token () {
    //   let result = ''
    //   if (this.contentAppId) {
    //     result = JSON.parse(window.localStorage.pluginsToken)[this.contentAppId].token
    //   }
    //   return result
    // }
  },

  ready () {
    let appId = this.$route.params.app_id
    // 从 localStorage 中获取app token
    let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
    let params = {
      filter: ['name', 'content'],
      limit: 1,
      offset: 0,
      query: {
        _id: this.$route.params.id
      }
    }
    api.operate.getOperatePositions(appId, token, params).then((res) => {
      if (res.status === 200) {
        this.operatePosition = res.data.list[0]
      }
    })
    this.init()
  },

  watch: {
    allPlugins () {
      this.init()
    },

    token () {
      if (this.formType === 'add') return

      let condition = {
        limit: 1,
        offset: 0,
        query: {
          _id: {
            $in: [this.$route.params.contentId]
          }
        }
      }

      api.operate.getOperatePositionContent(this.$route.params.app_id, this.token, condition).then((res) => {
        if (res.status === 200) {
          let data = res.data.list[0]
          this.selectedContent = data
          this.images = data.images
        }
      })
    }
  },

  methods: {
    init () {
      if (!this.allPlugins.length) return
      let contentType = this.$route.params.contentType
      this.allPlugins.forEach((item) => {
        if ((item.plugin === 'content' && contentType === 'article') || (item.plugin === 'recipe' && (contentType === 'recipes' || contentType === 'menu'))) {
          this.contentAppId = item.id
        }
      })

      // 获取需要的插件 tonken
      this._getTokenByAppId(this.contentAppId)
    },

    _getTokenByAppId (appId) {
      // apptoken过期时间 单位小时 可以输入小数
      const INVALIDTIME = 1 // (小时)
      var pluginsToken = {}
      if (window.localStorage.pluginsToken) {
        pluginsToken = JSON.parse(window.localStorage.pluginsToken)
      }
      var appTokenInvalidTime = pluginsToken[appId] && pluginsToken[appId].appTokenInvalidTime - 0
      var appTokenValid = appTokenInvalidTime > +new Date()
      if (appTokenValid) { // appToken未过期
        this.token = pluginsToken[appId].token
      } else { // appToken过期
        var params = {
          'app_id': appId
        }
        api.plugin.getAppToKen(params).then((res) => {
          pluginsToken = JSON.parse(window.localStorage.pluginsToken)
          var params = {
            appTokenInvalidTime: +new Date() + (1000 * 60 * 60) * INVALIDTIME,
            token: res.data.access_token,
            app_id: res.data.app_id
          }
          // 重置appToken过期时间
          pluginsToken[appId] = params
          window.localStorage.pluginsToken = JSON.stringify(pluginsToken)
          this.token = res.data.access_token
          // window.localStorage[appId + 'AppToken'] = JSON.stringify(params)
        })
      }
    },

    /**
     * 选择内容
     * @author shengzhi
     */
    selectContent () {
      this.isShowSelectedModal = true
      this.getContentList()
    },

    /**
     * 获取内容列表
     * @author shengzhi
     */
    getContentList (reset) {
      if (reset) {
        this.currentPage = 1
      }
      // let params = this.queryCondition
      let process

      switch (this.$route.params.contentType) {
        case 'article':
          process = api.content.getArticleList(this.contentAppId, this.queryCondition)
          break
        case 'recipes':
          process = api.recipes.getRecipes(this.contentAppId, this.token, this.queryCondition)
          break
        case 'menu':
          process = api.recipes.getMenus(this.contentAppId, this.token, this.queryCondition)
          break
        default:
      }

      this.loadingData = true
      process.then((res) => {
        this.contentList = res.data.list
        this.total = res.data.count
        this.loadingData = false
      })
    },

    /**
     * 确认选择内容
     * @return {[type]} [description]
     */
    confirmSelect () {
      this.selectedContent = this.modalSelectedContent
      this.isShowSelectedModal = false
    },
    /**
     * 取消选择内容
     * @return {[type]} [description]
     */
    cancelSelect () {
      this.isShowSelectedModal = false
    },
    /**
     * 选择图片
     * @param  {[type]} images [description]
     * @return {[type]}        [description]
     */
    onModifiedImages (images) {
      this.images = images
    },

    /**
     * 处理页码更新
     */
    onPageUpdate (page) {
      this.currentPage = page
      this.getContentList()
    },

    /**
     * 处理提交
     */
    onSubmit () {
      if (!this.selectedContent.name) {
        this.showNotice({
          type: 'error',
          content: '请选择内容'
        })
        return
      }
      const MODULES = {
        article: 'contents',
        recipes: 'recipes',
        menu: 'recipes'
      }
      const APIS = {
        article: 'article',
        recipes: 'recipes',
        menu: 'menu'
      }
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let contentType = this.$route.params.contentType
      let params = {
        name: this.selectedContent.name,
        images: this.images,
        module: MODULES[contentType],
        api: APIS[contentType],
        id: this.selectedContent._id,
        creator: this.currentMember.name
      }

      if (this.formType === 'add') { // 添加
        api.operate.addOperatePositionContent(appId, token, params).then((res) => {
          if (res.status === 200) {
            let content = _.clone(this.operatePosition.content) || []
            content.push({
              index: content.length + 1,
              id: res.data._id
            })
            let contentParams = {
              content: content
            }
            api.operate.updateOperatePosition(appId, token, contentParams, this.$route.params.id).then((r) => {
              if (r.status === 200) {
                this.showNotice({
                  type: 'success',
                  content: '运营位内容添加成功'
                })
                this.$route.router.replace(`/operation/plugins/operateposition/${this.$route.params.app_id}/stall/${this.$route.params.id}`)
              }
            })
          }
        })
      } else { // 编辑
        api.operate.updateOperatePositionContent(appId, token, params, this.$route.params.contentId).then((res) => {
          if (res.status === 200) {
            this.showNotice({
              type: 'success',
              content: '运营位内容更新成功'
            })
            this.$route.router.replace(`/operation/plugins/operateposition/${this.$route.params.app_id}/stall/${this.$route.params.id}`)
          }
        })
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getContentList()
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'

.panel-bd
  .content-form
    margin-bottom 30px
</style>
