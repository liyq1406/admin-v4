<template>
  <div class="main stall-details">
    <div class="main-title">
      <h2>运营位管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <!-- <div class="icon-loading" v-show="true">
      <i class="fa fa-refresh fa-spin"></i>
    </div> -->
    <!-- <div class="breadcrumb"><a v-link="{path: '/plugins/operate/'+ $route.params.app_id }"><i class="fa fa-arrow-circle-left"></i>运营管理</a></div> -->

    <div class="panel mt20">
      <div class="panel-hd">
        <div class="actions">
          <button class="btn btn-ghost" @click="addContent"><i class="fa fa-plus"></i>添加内容</button>
        </div>
        <h2>{{ operatePosition.name }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>名称</th>
                <th class="w180">图片</th>
                <th class="w80 tac">排序</th>
                <th class="w60 tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-show="stallContentList.length>0" v-for="stallContent in stallContentList">
                <tr>
                  <td>
                    <a class="hl-red" v-link="{'path': '/operate/stall/' + stallContent.id}">
                      {{stallContent.name}}
                    </a>
                  </td>
                  <td>
                    <div class="picture-box">
                      <div v-for="image in stallContent.images" class="picture" :style="'background-image:url('+ image +')'"></div>
                    </div>
                  </td>
                  <td>
                    <div class="button-list">
                      <div class="control-button button-up fl" :class="{'disabled': $index === 0}" @click="moveUp(stallContent, $index)">
                        <i class="fa fa-long-arrow-up"></i>
                      </div>
                      <div class="control-button button-down fr" :class="{'disabled': $index === stallContentList.length - 1}"  @click="moveDown(stallContent, $index)">
                        <i class="fa fa-long-arrow-down"></i>
                      </div>
                    </div>
                  </td>
                  <td class="tac">
                    <a class="hl-red" @click="deleteContent(stallContent)">删除</a>
                  </td>
                </tr>
              </template>
              <tr v-if="stallContentList.length === 0 && !loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import { globalMixins } from 'src/mixins'
import api from 'api'

export default {
  name: 'operate-stall-details',

  layout: 'admin',

  mixins: [globalMixins],

  components: {
    Breadcrumb
  },

  data () {
    return {
      // 正在加载数据
      loadingData: false,
      // 正在删除的索引
      deletingIndex: -1,
      operatePosition: {},
      // 内容列表
      stallContentList: []
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
          label: this.operatePosition.name
        })
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
      api.operate.getOperatePosition(this.appID, token, params).then((res) => {
        this.operatePosition = res.data.list[0]
      })
      this.getOperatePositionContents()
    }
  },

  methods: {
    /**
     * 添加运营位内容
     */
    addContent () {
      this.$route.router.go({path: 'add', append: true})
    },

    /**
     * 获取运营位内容列表
     */
    getOperatePositionContents () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      var condition = {
        limit: 100,
        offset: 0
      }

      api.operate.getOperatePositionContent(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.stallContentList = res.data.list
        }
      })
    },

    /**
     * 删除运营位内容
     * @param  {[type]} stallContent [description]
     * @param  {[type]} index        [description]
     * @return {[type]}              [description]
     */
    deleteContent (stallContent) {
      if (!window.confirm('确定删除该运营位内容?')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.operate.delOperatePositionContent(appId, token, stallContent._id).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '运营位内容删除成功'
          })
          this.getOperatePositionContents()
        }
      })
    },

    /**
     * 上移
     * @param  {[type]} stallContent [description]
     * @param  {[type]} $index       [description]
     * @return {[type]}              [description]
     */
    moveUp (stallContent, index) {
      if (index === 0) {
        return
      } else {
        this.stallContentList.splice(index, 1)
        this.stallContentList.splice(index - 1, 0, stallContent)
      }
    },
    /**
     * 下移
     * @param  {[type]} stallContent [description]
     * @param  {[type]} index        [description]
     * @return {[type]}              [description]
     */
    moveDown (stallContent, index) {
      if (index === this.stallContentList.length - 1) {
        return
      } else {
        this.stallContentList.splice(index, 1)
        this.stallContentList.splice(index + 1, 0, stallContent)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.stall-details
  .panel-bd
    .action-bar
      .title
        display block
        height 32px
        line-height 32px
        font-size 15px
    .picture-box
      width 100%
      height 150px
      overflow hidden
      .picture
        width 100%
        height 100%
        background-repeat no-repeat
        background-size 100% auto
        background-position center center
        background-color transparent
    .button-list
      padding 0 10px
      box-sizing border-box
      .control-button
        width 25px
        height 25px
        line-height 25px
        background red
        color #fff
        text-align center
        cursor pointer
      .disabled
        background #999
        cursor not-allowed
  a.disabled
    color #999
    cursor not-allowed
    text-decoration none
</style>
