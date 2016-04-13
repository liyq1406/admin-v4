<template>
  <section class="main-wrap">
    <div class="main">
      <div class="row">
        <div class="col-20">
          <!-- Start: 管理台-->
          <div class="panel">
            <div class="panel-hd">
              <div v-text="new Date() | formatDate" class="date"></div>
              <h2>{{ $t("dashboard.platform") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="statistic">
                <div class="statistic-item device-count">
                  <div class="fa fa-link"></div>
                  <div class="num">{{ totalSummary.total }}</div>
                  <div class="label">{{ $t("dashboard.statistic.total") }}</div>
                </div>
                <div class="statistic-item active-count">
                  <div class="fa fa-magic"></div>
                  <div class="num">{{ totalSummary.activated }}</div>
                  <div class="label">{{ $t("dashboard.statistic.activated") }}</div>
                </div>
                <div class="statistic-item online-count">
                  <div class="fa fa-wifi"></div>
                  <div class="num">{{ totalSummary.online }}</div>
                  <div class="label">{{ $t("dashboard.statistic.online") }}</div>
                </div>
                <div class="statistic-item user-count">
                  <div class="fa fa-users"></div>
                  <div class="num">{{ userSummary.user }}</div>
                  <div class="label">{{ $t("dashboard.statistic.user") }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Start: 管理台-->
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <!-- Start: 告警-->
          <!-- End: 告警-->
          <!-- Start: 快速指南-->
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t("dashboard.guide") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="post-list">
                <ul>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20iOS%20SDK接口文档.md" target="_blank">XLINK SDK iOS 集成文档</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20Android%20SDK接口文档.md" target="_blank">XLINK SDK Android 集成文档</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/应用端RESTful接口文档/设备功能接口.md#device_share" target="_blank">[用户] 设备分享接口</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/应用端RESTful接口文档/设备功能接口.md#device_newest_version" target="_blank">[用户] 设备升级接口</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/微信智能硬件接入指南.md" target="_blank">[企业应用] 微信接入指南</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/物联平台管理接口文档/授权管理.md" target="_blank">[企业应用] 授权管理</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/物联平台管理接口文档/数据统计分析接口.md" target="_blank">[企业应用] 统计分析</a></li>
                </ul>
              </div>
            </div>
          </div>
          <!-- End: 快速指南-->
        </div>
        <div class="col-8">
          <!-- Start: 文档-->
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t("dashboard.documents") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="doc-list">
                <div class="doc-list-item"><a href="http://support.xlink.cn/hc/kb/article/85600/" target="_blank" class="fa fa-apple"></a>
                  <div class="info">
                    <h3><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20iOS%20SDK接口文档.md" target="_blank">iOS SDK</a></h3>
                    <p>提供iOS开发文档说明</p>
                  </div>
                </div>
                <div class="doc-list-item"><a href="http://support.xlink.cn/hc/kb/article/85441/" target="_blank" class="fa fa-android"></a>
                  <div class="info">
                    <h3><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20Android%20SDK接口文档.md" target="_blank">Android SDK</a></h3>
                    <p>提供Android开发文档说明</p>
                  </div>
                </div>
                <div class="doc-list-item"><a href="#" target="_blank" class="fa fa-th-large"></a>
                  <div class="info">
                    <h3><a href="#" target="_blank">APP 开发示例</a></h3>
                    <p>云智易平台提供了丰富的接口</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End: 文档-->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../api'
  import Vue from 'vue'

  export default {
    name: 'Dashboard',

    data () {
      return {
        totalSummary: {
          total: 0,
          activated: 0,
          online: 0
        },
        userSummary: {
          user: 0
        }
      }
    },

    filters: {
      formatDate (date) {
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        if (Vue.config.lang === 'en-us') {
          var weekArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          return year + '-' + (month + 1) + '-' + day + ', ' + weekArr[date.getDay()]
        } else {
          return year + '年' + (month + 1) + '月' + day + '日 星期' + '日一二三四五六'.charAt(date.getDay())
        }
      }
    },

    route: {
      data () {
        api.statistics.getSummary().then((res) => {
          if (res.status === 200) {
            this.totalSummary = res.data.total
            this.userSummary = res.data.user
          }
        }).catch((error) => {
          this.handleError(error)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .statistic
    font-size 0
    margin 0 -25px
    padding 25px 0

    .statistic-item
      display inline-block
      width 25%
      padding 10px 0
      font-size 14px
      box-sizing border-box
      border-right 1px solid #E6E6E6
      text-align right

      .fa
        float left
        size 42px
        margin-left 25px
        border-radius 30px
        text-align center
        line-height 42px
        font-size 24px
        color #FFF

      .num
      .label
        margin-right 25px

      .num
        font-size 38px
        line-height 44px
        height 44px

      .label
        color #999

      &:last-child
        border-right none

    .device-count
      .num
        color #0092D6

      .fa
        background #0092D6

    .active-count
      .num
        color #27A9B0

      .fa
        background #27A9B0

    .online-count
      .num
        color #3A749A

      .fa
        background #3A749A

  .user-count
    .num
      color #FA6659

    .fa
      background #FA6659

  // 文章列表
  .post-list
    padding 5px 0

    ul
      reset-list()

    li
      position relative
      margin 18px 0
      padding-left 20px

      &:before
        absolute left 2px top
        content "\2022"

  // 文档
  .doc-list
    .doc-list-item
      display block
      margin 25px 0
      clearfix()

      .fa
        float left
        size 36px
        border 1px solid #E9E9E9
        text-align center
        line-height 36px
        font-size 24px
        transition color .3s

        &:hover
          text-decoration none

      .fa-apple
        color #B6B6B6

        &:hover
          color darken(@color, 20%)

      .fa-android
        color #74B939

        &:hover
          color darken(@color, 20%)

      .fa-th-large
        color #5899C2

        &:hover
          color darken(@color, 20%)

      .info
        margin-left 56px

      h3
        margin 0
        font-size 14px
        color #666

        a
          transition color .3s

      p
        margin 0
        font-size 12px
        color #999
</style>
