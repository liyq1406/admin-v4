<template>
  <section class="main-wrap stall-details">
    <div class="main snapshot-details with-loading">
      <!-- <div class="icon-loading" v-show="true">
        <i class="fa fa-refresh fa-spin"></i>
      </div> -->
      <div class="breadcrumb"><a v-link="{path: '/plugins/operate/'+ $route.params.app_id }"><i class="fa fa-arrow-circle-left"></i>运营管理</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-hd">
              <h2>管理运营位</h2>
            </div>
            <div class="panel-bd">

              <div class="action-bar row">
                <span class="title col-12">轮播图</span>
                <div class="action-group col-12">
                  <button class="btn btn-success fr" @click="addContent">
                    <i class="fa fa-plus"></i>
                    添加内容
                  </button>
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
                            <div class="picture" :style="'background-image:url('+ stallContent.img +')'"></div>
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
                          <a :class="deletingIndex === $index?'disabled':'hl-red'" @click="deleteContent(stallContent, $index)">
                            {{deletingIndex === $index? '删除中..': '删除'}}
                          </a>
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
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'operate-stall-details',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
    },

    data () {
      return {
        // 正在加载数据
        loadingData: false,
        // 正在删除的索引
        deletingIndex: -1,
        // 内容列表
        stallContentList: [
          {
            id: '111',
            name: '四月水果当季尝11',
            img: 'http://i3.meishichina.com/attachment/recipe/2014/06/11/20140611140717217157565.jpg'
          },
          {
            id: '222',
            name: '四月水果当季尝222',
            img: 'http://img5q.duitang.com/uploads/blog/201403/18/20140318120254_LXV4P.jpeg'
          },
          {
            id: '333',
            name: '四月水果当季尝333',
            img: 'http://i3.meishichina.com/attachment/recipe/2014/06/11/20140611140717217157565.jpg'
          },
          {
            id: '444',
            name: '四月水果当季尝444',
            img: 'http://img5q.duitang.com/uploads/blog/201403/18/20140318120254_LXV4P.jpeg'
          }
        ]
      }
    },

    route: {
      data () {
      }
    },
    methods: {
      /**
       * 添加运营位内容
       */
      addContent () {
        this.$route.router.go('/plugins/operate/' + this.$route.params.app_id + '/stall/' + this.$route.params.stallId + '/add')
      },
      /**
       * 删除运营位内容
       * @param  {[type]} stallContent [description]
       * @param  {[type]} index        [description]
       * @return {[type]}              [description]
       */
      deleteContent (stallContent, index) {
        this.deletingIndex = index
        setTimeout(() => {
          this.stallContentList.$remove(stallContent)
          this.deletingIndex = -1
        }, 1000)
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
