<template>
  <div class="main with-loading">
    <div class="main-title">
      <h2>运营位管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-4">请选择类型:</label>
            <div class="controls col-20">
              <div class="radio-group">
                <label class="radio" v-for="(key, type) in types">
                  <input type="radio" v-model="selectedType" name="type" :value="type"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="form content-form">
          <div class="form-row row">
            <label class="form-control col-4">内容:</label>
            <div class="controls col-20">
              <a class="hl-red control-text" v-show="selectedContent.name" @click="selectContent">{{ selectedContent.name }}</a>
              <button class="btn btn-ghost w100" v-show="!selectedContent.name" @click="selectContent"><i class="fa fa-plus"></i>选择{{ selectedType.label }}</button>
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
    </div>
    <modal :show.sync="isShowSelectedModal" @close="cancelSelect" :width="'600px'">
      <h3 slot="header">添加{{ selectedType.label }}</h3>
      <div slot="body" class="selected-content-box form">
        <form @submit.prevent="confirmSelect">
          <div class="form-row row">
            <div class="action-bar">
              <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.ingredient.placeholders.search_condi')" @cancel="getList(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getList(true)">
                <button slot="search-button" @click="getList(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
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
                    <th v-if="selectedType.value===1">类型</th>
                    <th>作者</th>
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
                      <td v-if="selectedType.value===1">{{ content.type }}</td>
                      <td>{{ content.creator }}</td>
                    </tr>
                  </template>
                  <tr v-if="contentList.length===0">
                    <td :colspan="selectedType.value===1 ? 4 : 3" class="tac">
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

export default {
  name: 'operate-stall-details',

  layout: 'admin',

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

  data () {
    return {
      breadcrumbNav: [{
        label: '运营位管理',
        link: `/operation/plugins/operate-position/${this.$route.params.app_id}`
      }, {
        label: '管理运营位'
      }],
      types: {
        content: {
          label: '文章',
          value: 0,
          appId: ''
        },
        recipe: {
          label: '菜谱',
          value: 1,
          appId: ''
        },
        menu: {
          label: '菜单',
          value: 2,
          appId: ''
        }
      },
      selectedType: {},
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
      // 图片列表
      images: [''],
      // 浮层上的内容列表
      contentList: [],
      // 浮层上面已经选择的内容
      modalSelectedContent: {}
    }
  },

  computed: {
    breadcrumbNav () {
      let result = [{
        label: '运营位管理',
        link: `/operation/plugins/operate-position/${this.$route.params.app_id}`
      }]

      if (this.operatePosition.name) {
        result.push({
          label: this.operatePosition.name,
          link: `/operation/plugins/operate-position/${this.$route.params.app_id}/stall/${this.$route.params.id}`
        })
        result.push({
          label: '添加内容'
        })
      }

      return result
    },

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
    },

    token () {
      let result = ''
      if (this.selectedType.appId) {
        result = JSON.parse(window.localStorage.pluginsToken)[this.selectedType.appId].token
      }
      return result
    }
  },

  route: {
    data () {
      this.appID = this.$route.params.app_id
      let token = JSON.parse(window.localStorage.pluginsToken)[this.appID].token
      let params = {
        filter: ['name'],
        limit: 1,
        offset: 0
      }
      api.operate.getOperatePositions(this.appID, token, params).then((res) => {
        this.operatePosition = res.data.list[0]
      })
      this.init()
    }
  },

  watch: {
    allPlugins () {
      this.init()
    }
  },

  methods: {
    init () {
      if (!this.allPlugins.length) return
      let plugins = this.allPlugins.filter((item) => {
        let flag = false
        if (item.plugin === 'content') {
          this.types.content.appId = item.id
          flag = true
        } else if (item.plugin === 'recipe') {
          this.types.recipe.appId = item.id
          this.types.menu.appId = item.id
          flag = true
        }
        return flag
      })
      this.selectedType = this.types.content

      // 获取需要的插件 tonken
      for (let i = 0, len = plugins.length; i < len; i++) {
        ((index) => {
          console.log(index)
          this._getTokenByAppId(plugins[i].id)
        })(i)
      }
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
      if (!appTokenValid) { // appToken过期
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
      this.getList()
    },

    /**
     * 获取内容列表
     * @author shengzhi
     */
    getList (reset) {
      if (reset) {
        this.currentPage = 1
      }
      // let params = this.queryCondition
      let appId = this.selectedType.appId
      let process

      switch (this.selectedType.value) {
        case 0:
          process = api.content.getArticleList(appId, this.queryCondition)
          break
        case 1:
          process = api.recipes.getRecipes(appId, this.token, this.queryCondition)
          break
        case 2:
          process = api.recipes.getMenus(appId, this.token, this.queryCondition)
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
     * 已选中的内容变化
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    selectedContentChange (content) {
      console.log(content)
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
      this.getList()
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
      const MODULES = ['contents', 'recipes', 'recipes']
      const APIS = ['article', 'recipes', 'menu']
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let params = {
        name: this.selectedContent.name,
        images: this.images,
        module: MODULES[this.selectedType.value],
        api: APIS[this.selectedType.value],
        id: this.selectedContent._id,
        creator: this.currentMember.name
      }
      api.operate.addOperatePositionContent(appId, token, params).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '运营位内容添加成功'
          })
          this.$route.router.replace(`/operation/plugins/operate-position/${this.$route.params.app_id}/stall/${this.$route.params.id}`)
        }
      })
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getList()
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.panel-bd
  .form
    padding 30px 0 0
  .content-form
    border 1px solid light-border-color
    padding 20px
    margin-bottom 30px
</style>
