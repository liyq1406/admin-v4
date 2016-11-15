<template>
  <div class="main stall-details">
    <div class="main-title">
      <h2>运营位管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-hd">
        <div class="actions">
          <dropdown :trigger-width="90" :dropdown-width="130" :show="isShowDropdown" @toggle="onDropdownToggle">
            <button class="btn btn-primary" slot="trigger" :class="{'disabled': loadingData || contentList.length>=maxCount}" :disabled="loadingData || contentList.length>=maxCount">添加内容 <i class="fa fa-caret-down"></i></button>
            <div class="dropdown-menu">
              <div class="dropdown-menu-item" v-for="(type, label) in types" @click="addContent(type)">{{ label }}</div>
            </div>
          </dropdown>
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
                <th class="wp30 tac">图片</th>
                <th class="wp16 tac">排序</th>
                <th class="wp10 tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-show="orderedContentList.length>0" v-for="content in orderedContentList">
                <tr>
                  <td>
                    <a class="hl-red" v-link="{path: 'edit/' + content.api + '/' + content._id, append: true}">
                      {{content.name}}
                    </a>
                  </td>
                  <td>
                    <div class="picture-box">
                      <div v-for="image in content.images" class="picture" :style="'background-image:url('+ image +')'"></div>
                    </div>
                  </td>
                  <td>
                    <div class="button-list">
                      <div class="control-button button-up fl" :class="{'disabled': $index === 0 || ordering}" @click="moveUp($index)">
                        <i class="fa fa-long-arrow-up"></i>
                      </div>
                      <div class="control-button button-down fr" :class="{'disabled': $index === orderedContentList.length - 1 || ordering}" @click="moveDown($index)">
                        <i class="fa fa-long-arrow-down"></i>
                      </div>
                    </div>
                  </td>
                  <td class="tac">
                    <a class="hl-red" @click="deleteContent(content)">删除</a>
                  </td>
                </tr>
              </template>
              <tr v-if="orderedContentList.length === 0">
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
import api from 'api'

export default {
  name: 'operate-stall-details',

  layout: 'admin',
  data () {
    return {
      // 最大的允许添加数量
      maxCount: 10000,
      // 正在加载数据
      loadingData: true,
      // 正在删除的索引
      deletingIndex: -1,
      operatePosition: {},
      // 内容列表
      contentList: [],
      // 内容类型
      types: {
        'article': '文章',
        'recipes': '菜谱',
        'menu': '菜单'
      },
      ordering: false,
      isShowDropdown: false
    }
  },

  computed: {
    // 已排序内容列表
    orderedContentList () {
      let result = []
      let contentArr = this.operatePosition.content

      if (contentArr && contentArr.length) {
        contentArr.forEach((item) => {
          let content = _.find(this.contentList, (o) => {
            return o._id === item.id
          })
          if (content) {
            result.push(content)
          }
        })
      }

      return result
    },

    // 面包屑导航
    breadcrumbNav () {
      let result = [{
        label: '运营位管理',
        link: `/operation/plugins/operateposition/${this.$route.params.app_id}`
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
      this.getOperatePositionContents()
    }
  },

  methods: {
    /**
     * 添加运营位内容
     */
    addContent (type) {
      this.$route.router.go({path: `add/${type}`, append: true})
    },

    /**
     * 获取运营位内容列表
     */
    getOperatePositionContents () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let params = {
        filter: ['_id', 'name', 'content'],
        limit: 1,
        offset: 0,
        query: {
          _id: this.$route.params.id
        }
      }
      api.operate.getOperatePositions(appId, token, params).then((res) => {
        if (res.status === 200) {
          this.operatePosition = res.data.list[0]
          let condition = {
            filter: ['_id', 'name', 'images', 'api'],
            limit: 100,
            offset: 0,
            query: {
              _id: {
                $in: _.map(this.operatePosition.content, 'id')
              }
            }
          }

          api.operate.getOperatePositionContent(appId, token, condition).then((r) => {
            if (r.status === 200) {
              this.contentList = r.data.list
              this.ordering = false
              this.loadingData = false
            }
          })
        }
      })
    },

    /**
     * 删除运营位内容
     * @param  {[type]} content [description]
     * @param  {[type]} index        [description]
     * @return {[type]}              [description]
     */
    deleteContent (content) {
      if (!window.confirm('确定删除该运营位内容?')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.operate.delOperatePositionContent(appId, token, content._id).then((res) => {
        if (res.status === 200) {
          let contentArr = _.clone(this.operatePosition.content) || []
          _.remove(contentArr, (item) => {
            return item.id === content._id
          })
          contentArr = _.map(contentArr, (item, index) => {
            return {
              index: index + 1,
              id: item.id
            }
          })
          let contentParams = {
            content: contentArr
          }
          api.operate.updateOperatePosition(appId, token, contentParams, this.$route.params.id).then((r) => {
            if (r.status === 200) {
              this.showNotice({
                type: 'success',
                content: '运营位内容删除成功'
              })
              this.getOperatePositionContents()
            }
          })
        }
      })
    },

    /**
     * 更新排序
     */
    updateOrder () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      // let content = _.clone(this.operatePosition.content) || []
      // if (this.formType === 'add') {
      //   content.push({
      //     index: content.length + 1,
      //     id: res.data._id
      //   })
      // } else {
      //
      // }
      let content = _.map(this.operatePosition.content, (item, index) => {
        return {
          index: index + 1,
          id: item.id
        }
      })
      let contentParams = {
        content: content
      }
      this.ordering = true
      api.operate.updateOperatePosition(appId, token, contentParams, this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.getOperatePositionContents()
        }
      })
    },

    /**
     * 上移
     * @param  {[type]} $index       [description]
     * @return {[type]}              [description]
     */
    moveUp (index) {
      if (index === 0) {
        return
      } else {
        let content = this.operatePosition.content
        let obj = content.splice(index, 1)[0]
        content.splice(index - 1, 0, obj)
        this.updateOrder()
      }
    },
    /**
     * 下移
     * @param  {[type]} index        [description]
     * @return {[type]}              [description]
     */
    moveDown (index) {
      if (index === this.contentList.length - 1) {
        return
      } else {
        let content = this.operatePosition.content
        let obj = content.splice(index, 1)[0]
        content.splice(index + 1, 0, obj)
        this.updateOrder()
      }
    },

    /**
     * 处理下拉状态切换
     */
    onDropdownToggle (show) {
      if (!this.loadingData && this.contentList.length < this.maxCount) {
        this.isShowDropdown = !show
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.dropdown-menu
  .dropdown-menu-item
    line-height 26px
    padding 0 15px
    cursor pointer
    font-size 13px

    &:hover
      background-color #E7F2F4

.stall-details
  .panel-bd
    .action-bar
      .title
        display block
        height 32px
        line-height 32px
        font-size 15px
    .picture-box
      width 200px
      height 150px
      margin 0 auto
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
      width 80px
      margin 0 auto
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
