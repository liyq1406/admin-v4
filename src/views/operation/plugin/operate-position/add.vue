<template>
  <section class="main-wrap stall-details-add">
    <div class="main snapshot-details with-loading">
      <!-- <div class="icon-loading" v-show="true">
        <i class="fa fa-refresh fa-spin"></i>
      </div> -->
      <div class="breadcrumb"><a v-link="{path: '/plugins/operate/'+ $route.params.app_id +'/stall/'+ $route.params.stallId }"><i class="fa fa-arrow-circle-left"></i>管理运营位</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-hd">
              <h2>添加内容</h2>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-6">内容:</label>
                  <div class="controls col-18">
                    <div class="selected-content" v-show="selctedContent.title" @click="isShowSelectedModal = true">
                      <a>{{ selctedContent.title }}</a>
                    </div>
                    <button class="btn btn-ghost w100" v-show="!selctedContent.title" @click="isShowSelectedModal = true"><i class="fa fa-plus"></i>选择{{typeText}}</button>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-6">运营图片:</label>
                  <div class="controls col-18">
                    <div class="img-box">
                      <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
                    </div>
                  </div>
                </div>
                <div class="form-actions row">
                  <div class="col-offset-6">
                    <button class="btn btn-primary w100" @click="">提交</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal :show.sync="isShowSelectedModal" @close="cancelSelect" :width="'600px'">
        <h3 slot="header">添加菜谱</h3>
        <div slot="body" class="selected-content-box form">
          <form @submit.prevent="confirmSelect">
            <div class="form-row row">
              <div class="action-bar">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.ingredient.placeholders.search_condi')" @cancel="getList" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getList">
                  <button slot="search-button" @click="getList" class="btn btn-primary">{{ $t('common.search') }}</button>
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
                      <th>类型</th>
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
                        <td>222</td>
                        <td>333</td>
                        <td>222</td>
                      </tr>
                    </template>
                    <tr v-if="contentList.length === 0 && !loadingData">
                      <td colspan="4" class="tac">
                        <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getList"></pager>
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
  </section>
</template>

<script>
  import Modal from 'components/Modal'
  import ImageUploader from 'components/ImageUploader'
  import SearchBox from 'components/SearchBox'
  import * as config from 'consts/config'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'operate-stall-details',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'search-box': SearchBox,
      'image-uploader': ImageUploader
    },

    data () {
      return {
        isShowSelectedModal: false,
        loadingData: false,
        selecting: false,
        query: '',
        searching: false,
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        // 已经选择的内容
        selctedContent: {
          title: ''
        },
        // 图片列表
        images: [''],
        // 浮层上的内容列表
        contentList: [
          {
            id: '111',
            title: '111',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '222',
            title: '222',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '333',
            title: '333',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '444',
            title: '222',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '555',
            title: '333',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '666',
            title: '222',
            type: '12132',
            auther: 'ni '
          },
          {
            id: '777',
            title: '333',
            type: '12132',
            auther: 'ni '
          }
        ],
        // 浮层上面已经选择的内容
        modalSelectedContent: {}
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {'create_date': 'desc'},
          query: {}
        }

        if (this.query.length > 0) {
          condition.query['account'] = { $like: this.query }
        }

        return condition
      },
      // 当前类别文字显示
      typeText () {
        var result = {
          '0': '文章',
          '1': '菜谱',
          '2': '菜单'
        }
        return result[this.$route.query.type] || '文章'
      }
    },
    route: {
      data () {
      }
    },
    methods: {
      /**
       * 获取内容列表
       * @return {[type]} [description]
       */
      getList () {
        var params = this.queryCondition
        console.log('获取内容列表' + JSON.stringify(params))
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
        console.log('确认选择内容')
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
        console.log(images)
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

  .stall-details-add
    .panel-bd
      .selected-content
        height 32px
        line-height 32px
</style>
