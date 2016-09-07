<template>
  <div class="jumbotron-box">
    <div class="content-box">
      <!-- 流程 -->
      <div class="content content1" v-show="selectedTabIndex===0" transition="scale">
        <div class="title-box">
          <p class="title1">开发者自助接入流程</p>
          <p class="title2">云智易开发平台，智能设备一站式开发服务平台</p>
        </div>
        <div class="line"></div>
        <div class="process-box clearfix">
          <div class="process fl" v-for="process in processes">
            <div class="icon-box">
              <i class="icon" :class="process.img"></i>
            </div>
            <div class="title">
              <span>{{process.title}}</span>
            </div>
            <div class="describe">
              <span>{{process.describe}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content" v-for="introduce in introduces" :class="'content' + ($index+2)" v-show="selectedTabIndex===$index+1" transition="scale">
        <div class="text-box">
          <div class="title">
            <span class="title1">{{introduce.title1}}</span>
            ·
            <span class="title2">{{introduce.title2}}</span>
          </div>
          <div class="describe">
            <p v-for="describe in introduce.describes">{{describe}}</p>
          </div>
          <button class="btn btn-primary" @click="goto(introduce.link)">了解详情</button>
        </div>
        <div class="img-box">
          <div class="img" :class="introduce.key"></div>
        </div>
      </div>

    </div>
    <div class="tab-box clearfix">
      <div class="tab fl" :class="{'selected': $index === selectedTabIndex}" v-for="tab in tabs" @click="selectedTabIndex=$index">
        <span>{{tab.title}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'jumbotron',
    data () {
      return {
        selectedTabIndex: 0,
        tabs: [
          {
            title: '接入流程'
          },
          {
            title: '调试与告警'
          },
          {
            title: '智能互联'
          },
          {
            title: '固件管理'
          },
          {
            title: '数据管理'
          }
        ],
        processes: [
          {
            img: 'process1',
            title: '创建产品',
            describe: '创建一个新产品，开始你的智能之旅吧'
          },
          {
            img: 'process2',
            title: '配置产品',
            describe: '创建数据端点、导入产品模板'
          },
          {
            img: 'process3',
            title: '开发指引',
            describe: '虚拟设备与调试、告警规则'
          },
          {
            img: 'process4',
            title: '产测调试',
            describe: '自动化工具测试，调试更省心'
          },
          {
            img: 'process5',
            title: '发布产品',
            describe: '快捷发布、轻松管理'
          }
        ],
        introduces: [
          {
            key: 'alert',
            title1: '调试与告警',
            title2: '全方位实时监控',
            describes: [
              '远程实时调试，省心省力！',
              '灵活多变设定告警规则，设备故障第一时间通知到位！'
            ],
            link: '/operation/alerts/record'
          },
          {
            key: 'nest',
            title1: '智能互联',
            title2: '连接一切想象',
            describes: [
              '云智易Xlink平台已与Google nest、海尔U+、Google THREAD、微信互联、Apple Homekit、海康萤石、Philips Hue实现互联,通过平台配置快速融入其产品体系，实现智能领域云互联！'
            ],
            link: '/dev/linkage/settings'
          },
          {
            key: 'firmware',
            title1: '固件管理',
            title2: '远程管理便捷省心',
            describes: [
              '手动与自动升级，满足各个产品下的不同升级需求；',
              '1、支持固件版本的比较',
              '2、支持下载固件文件的数据校验',
              '3、自动上报升级结果'
            ],
            link: '/dev/firmware/manage'
          },
          // {
          //   key: 'apps',
          //   title1: '应用管理',
          //   title2: '应用周期全掌控',
          //   describes: [
          //     '手动与自动升级，满足各个产品下的不同升级需求；',
          //     '1、支持固件版本的比较',
          //     '2、支持下载固件文件的数据校验',
          //     '3、自动上报升级结果'
          //   ]
          // },
          {
            key: 'data',
            title1: '数据服务',
            title2: '应用周期全掌控',
            describes: [
              '为数据提供云端的时序化存储服务，并提供导出接口，便于与厂商已有的系统整合，或者结合第三方BI系统做数据分析和数据挖掘服务，并自行定制数据报告。'
            ],
            link: '/dev/data/tables'
          }
        ]
      }
    },

    methods: {
      goto (path) {
        this.$route.router.go(path)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'


  // 从右到左渐渐出现
  .scale-transition
    transition opacity .2s ease, transform .2s ease
    opacity 1
    transform translateX(0px)

  .scale-enter
  .scale-leave
    opacity 0
    transform translateX(20px)

  .jumbotron-box
    width 100%
    height 400px
    border 1px solid #ddd
    position relative
    overflow hidden
    .content-box
      width 100%
      height 100%
      position relative
      padding-bottom 40px
      box-sizing border-box
      .content
        position relative
        height 100%
        width 100%
      .content1
        .title-box
          height 105px
          text-align center
          overflow hidden
          z-index 1
          .title1
            margin-top 30px
            margin-bottom 0
            font-size 30px
            color #1E1E1E
            font-weight 100
          .title2
            margin 0
            font-size 12px
            color #BCBCBC
        .line
          width 90%
          height 1px
          background #ddd
          position absolute
          top 230px
          left 50%
          transform translateX(-50%)
          z-index -1
        .process-box
          width 100%
          height 100%
          padding 0 25px 105px
          box-sizing border-box
          z-index 1
          .process
            width 16%
            margin-right 5%
            height 100%
            background #fff
            &:last-child
              margin-right 0
            .icon-box
              width 75px
              height 75px
              margin 15px auto 20px
              .icon
                display block
                width 100%
                height 100%
                border-radius 50%
                overflow hidden
                background-size 75%
                background-position center
                background-repeat no-repeat
              .process1
                background-image url('../../../../assets/images/process1.png')
                background-color #eaead2
              .process2
                background-image url('../../../../assets/images/process2.png')
                background-color #eaead2
              .process3
                background-image url('../../../../assets/images/process3.png')
                background-color #dbe1de
              .process4
                background-image url('../../../../assets/images/process4.png')
                background-color #d7eff4
              .process5
                background-image url('../../../../assets/images/process5.png')
                background-color #d7eff4
            .title
              margin 15px auto 5px
              width 100%
              height 30px
              line-height 30px
              font-size 20px
              color red
              text-align center
            .describe
              padding 0 30px
              box-sizing border-box
              text-align center
              font-size 14px
              color #868686
      .content2
      .content3
      .content4
      .content5
      .content6
        padding-right 560px
        box-sizing border-box
        .text-box
          width 100%
          height 100%
          padding-left 50px
          padding-right 10px
          box-sizing border-box
          .title
            height 120px
            line-height 130px
            font-size 26px
            overflow hidden
            text-overflow 100%
            .title1
              color red
          .describe
            margin-top 10px
            margin-bottom 50px
            width 90%
            p
              margin 0
              font-size 14px
          .btn
            width 90px
            background-color #da4e37
            border 1px solid red
            box-sizing border-box
            border-radius 2px
        .img-box
          width 560px
          height 100%
          position absolute
          right 0
          top 0
          .img
            width 100%
            height 100%
            background no-repeat center center / auto 80%
          .alert
            background-image url('../../../../assets/images/pic-alert.png')
          .nest
            background-image url('../../../../assets/images/pic-nest.png')
          .firmware
            background-image url('../../../../assets/images/pic-firmware.png')
          /*.apps
            background-image url('../../../../assets/images/pic-alert.png')*/
          .data
            background-image url('../../../../assets/images/pic-data.png')
    .tab-box
      width 100%
      height 40px
      line-height 40px
      position absolute
      bottom 0
      box-sizing border-box
      .tab
        width 20%
        background #f7f7f7
        border-right 1px solid #ddd
        box-sizing border-box
        text-align center
        position relative
        border-top 1px solid #ddd
        border-bottom 1px solid #ddd
        cursor pointer
        box-sizing border-box
        margin 0
        /*overflow hidden*/
        &:last-child
          border-right 0
        &.selected
          background #cb4a52
          color #fff
          &:after
            content ""
            display block
            width 14px
            height 14px
            position absolute
            background #cb4a52
            top -5px
            left 50%
            margin-left -7px
            transform rotate(45deg)

</style>
