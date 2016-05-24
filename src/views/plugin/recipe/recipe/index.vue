<template>
  <div class="recipe-box">
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.ingredient.placeholders.search')" @cancel="getRecipes" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getRecipes">
            <button slot="search-button" @click="getRecipes" class="btn btn-primary">{{ $t('common.search') }}</button>
          </search-box>
          <div class="action-group"><a v-link="{path: '/plugins/recipe/' + $route.params.app_id + '/add'}" class="btn btn-success"><i class="fa fa-plus"></i>添加菜谱</a>
            <button @click="showCategoryModal=true" class="btn btn-success"><i class="fa fa-list-ul"></i>类别管理</button>
          </div>
        </div>
        <div class="status-bar">
          <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
          <v-select size="small" width="120px" placeholder="请选择类别" :label="category.label">
            <span slot="label">类别：</span>
            <select v-model="category" @change="getRecipes">
              <option v-for="option in categoryOptions" :value="option">{{ option.label }}</option>
            </select>
          </v-select>
          <v-select size="small" width="120px" placeholder="请选择烹饪设备" :label="device.label">
            <span slot="label">烹饪设备：</span>
            <select v-model="device" @change="getRecipes">
              <option v-for="option in deviceOptions" :value="option">{{ option.label }}</option>
            </select>
          </v-select>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>标题</th>
                <th>创建者</th>
                <th>创建时间</th>
                <th class="tac">{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="recipes.length > 0">
                <tr v-for="recipe in recipes">
                  <td>{{ recipe.name }}<i v-if="hasCloudRecipe(recipe.devices)" style="color: #35AA47;" class="fa fa-cloud ml5"></i></td>
                  <td>{{ recipe.created_by }}</td>
                  <td>{{ recipe.created_at | formatDate }}</td>
                  <td class="tac"><a v-link="{path: '/plugins/recipe/' + $route.params.app_id + '/' +recipe._id+'/edit'}" class="btn-link btn-mini">编辑</a></td>
                </tr>
              </template>
              <tr v-if="recipes.length === 0 && !loadingData">
                <td colspan="4" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :page-count="countPerPage" @page-update="getRecipes"></pager>
      </div>
    </div>
    <!-- 类别管理浮层-->
    <modal :show.sync="showCategoryModal">
      <h3 slot="header">类别管理</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onCateSubmit">
          <div class="form-row row">
            <div class="form-tips mb10">请输入菜谱类别，每行一个类别</div>
            <div class="input-text-wrap">
              <textarea v-model="categories | formatCategories" rows="8" class="input-text"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onCateCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import api from '../../../../api'
  import * as config from '../../../../consts/config'
  import Select from '../../../../components/Select'
  import Pager from '../../../../components/Pager'
  import Modal from '../../../../components/Modal'
  import SearchBox from '../../../../components/SearchBox'
  import { globalMixins } from '../../../../mixins'
  import { pluginMixins } from '../../mixins'

  export default {
    name: 'IngredientList',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-select': Select,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        showCategoryModal: false,
        total: 0,
        query: '',
        recipes: [],
        searching: false,
        category: {label: '全部', value: 'all'},
        categories: [],
        device: {label: '全部', value: 'all'},
        deviceOptions: [
          {label: '全部', value: 'all'},
          {label: '隔水炖', value: '隔水炖'},
          {label: '云炖锅', value: '云炖锅'},
          {label: '电饭煲', value: '电饭煲'},
          {label: '电水壶', value: '电水壶'}
        ],
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false
      }
    },

    computed: {
      /**
       * 构建菜谱分类选项
       * @return {Array} 分类选项
       */
      categoryOptions () {
        var arr = [{label: '全部', value: 'all'}]
        if (this.categories && this.categories.length > 0) {
          this.categories.map((item) => {
            let obj = {}
            obj.label = item.main
            obj.value = item.main
            arr.push(obj)
          })
          return arr
        }
      },

      /**
       * 菜谱查询条件
       * @return {Object} 查询条件
       */
      queryCondition () {
        var condition = {
          filter: ['_id', 'name', 'classification', 'devices', 'created_by', 'created_at'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {},
          order: {
            created_at: -1
          }
        }

        if (this.query.length > 0) {
          condition.query['name'] = { $like: this.query }
        }

        if (this.category.value === 'all') {
          delete condition.query['classification.main']
        } else {
          condition.query['classification.main'] = { $in: [this.category.value] }
        }

        if (this.device.value === 'all') {
          delete condition.query['devices.name']
        } else {
          condition.query['devices.name'] = { $in: [this.device.value] }
        }

        return condition
      }
    },

    route: {
      data () {
        // 获取菜谱类别
        this.getCategories()
        // 获取菜谱列表
        this.getRecipes()
      }
    },

    methods: {
      /**
       * 获取菜谱列表
       */
      getRecipes () {
        var self = this
        var argvs = arguments
        var fn = self.getRecipes
        this.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listRecipe(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            if (res.status === 200) {
              // 菜谱列表
              this.recipes = res.data.list
              // 记录数
              this.total = res.data.count
              this.loadingData = false
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      },

      /**
       * 获取分类
       */
      getCategories () {
        // this.categories = [{main: '粤菜', sub: ['客家菜', '顺德菜']}, {main: '东北菜', sub: []}]
        var self = this
        var argvs = arguments
        var fn = self.getCategories
        var condition = {
          query: {
            key: 'recipe_classification'
          }
        }
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listCategory(this.$route.params.app_id, token, condition).then((res) => {
            if (res.data.list.length > 0) {
              if (res.data.list[0].value) {
                this.categories = res.data.list[0].value
              }
            } else {
              this.categories = []
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
          })
        })
      },

      /**
       * 取消类别编辑
       */
      onCateCancel () {
        this.editing = false
        this.showCategoryModal = false
        // this.getCategories()
      },

      /**
       * 提交类别编辑
       */
      onCateSubmit () {
        this.editing = true
        var self = this
        var argvs = arguments
        var fn = self.onCateSubmit
        var condition = {
          key: 'recipe_classification',
          value: this.categories
        }
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.updateCategory(this.$route.params.app_id, token, condition).then((res) => {
            if (res.status === 200) {
              this.onCateCancel()
            }
          }).catch((err) => {
            this.onCateCancel()
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
          })
        })
      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getRecipes()
        }
      },

      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },

      // 取消搜索
      cancelSearching () {
        this.getRecipes()
      },

      /**
       * 判断是否带有云菜谱
       * @param  {Array}   devices 菜谱设备
       * @return {Boolean}         是否带有云菜谱
       */
      hasCloudRecipe (devices) {
        let flag = false
        devices.map((item) => {
          if (item.autoexec.length) {
            flag = true
          }
        })
        return flag
      }
    }
  }
</script>

<style lang="stylus" scoped>
.recipe-box
  .v-select
    display inline-block
    margin-right 30px

.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
