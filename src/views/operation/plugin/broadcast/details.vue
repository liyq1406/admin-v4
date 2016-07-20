<template>
  <div class="main">
    <div class="main-title">
      <h2>消息详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel"></div>
    <div class="row statistic-group">
      <div class="fiveDepart">
        <statistic :info="messageSummary.send" :title="messageSummary.send.title" align="left"></statistic>
      </div>
      <div class="fiveDepart">
        <statistic :info="messageSummary.arrival" :title="messageSummary.arrival.title" align="left"></statistic>
      </div>
      <div class="fiveDepart">
        <statistic :info="messageSummary.percent" :title="messageSummary.percent.title" align="left"></statistic>
      </div>
      <div class="fiveDepart">
        <statistic :info="messageSummary.open" :title="messageSummary.open.title" align="left"></statistic>
      </div>
      <div class="fiveDepart">
        <statistic :info="messageSummary.openPercent" :title="messageSummary.openPercent.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-hd">
        <h2>详细信息</h2>
      </div>
      <div class="panel-bd">
        <div class="x-info-list-wrap">
          <div class="x-info-list">
            <div class="x-info-list-item threeDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">推送方式</div>
                <div class="x-val">广播</div>
              </div>
            </div>
            <div class="x-info-list-item threeDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">推送人群</div>
                <div class="x-val">全部人</div>
              </div>
            </div>
            <div class="x-info-list-item threeDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">推送平台</div>
                <div class="x-val">IOS</div>
              </div>
            </div>
            <div class="x-info-list-item threeDepart">
              <div class="x-info-list-item-in" style="border-bottom:1px solid #d9d9d9">
                <div class="x-label">推送时间</div>
                <div class="x-val">2016-07-18 18:00:00</div>
              </div>
            </div>
            <div class="x-info-list-item threeDepart" style="border-bottom:1px solid #d9d9d9">
              <div class="x-info-list-item-in">
                <div class="x-label">过期时间</div>
                <div class="x-val">？？？</div>
              </div>
            </div>
            <div class="x-info-list-item threeDepart" style="border-bottom:1px solid #d9d9d9">
              <div class="x-info-list-item-in">
                <div class="x-label">打开方式</div>
                <div class="x-val">打开网页</div>
              </div>
            </div>
            <div class="x-info-list-item oneDepart">
              <div class="x-info-list-item-in" style="border-top:none">
                <div class="x-label">推送标题</div>
                <div class="x-val">您又被抽奖砸中啦！</div>
              </div>
            </div>
            <div class="x-info-list-item oneDepart">
              <div class="x-info-list-item-in">
                <div class="x-label">推送内容</div>
                <div class="x-val">还不快来！</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Statistic from 'components/Statistic'
  import Breadcrumb from 'components/Breadcrumb'

  export default {
    name: 'BroadcastDetails',

    mixins: [globalMixins],

    components: {
      Breadcrumb,
      Statistic
    },

    route: {
      data (transition) {
        var sendRoot = `/operation/plugins/broadcast/${this.$route.params.id}`

        return {
          breadcrumbNav: [{
            label: '消息历史',
            link: { path: `${sendRoot}/list` }
          }, {
            label: '当前'
          }]
        }
      }
    },

    data () {
      return {
        history: {},
        breadcrumbNav: [],
        messageSummary: {
          send: {
            total: 1345,
            title: '推送数'
          },
          arrival: {
            total: 1135,
            title: '抵达数'
          },
          percent: {
            total: 83,
            unit: '%',
            title: '抵达率'
          },
          open: {
            total: 232,
            title: '打开数'
          },
          openPercent: {
            total: 43,
            unit: '%',
            title: '打开率'
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
  .fiveDepart
    display inline-block
    width 19.5%
    border-right 1px solid #d9d9d9
  .fiveDepart:nth-last-child(1)
      border-right none

  .threeDepart
    width 30%
    margin-right 3%
  .oneDepart
    width 100%
  .x-info-list-wrap
    /*position relative*/
    overflow hidden

  .x-info-list
    margin-top -1px
    clearfix()

    .x-info-list-item
      float left
      line-height 22px
      box-sizing border-box

      .x-info-list-item-in
        padding 8px 0 8px 8px
        border-top 1px solid default-border-color

      .x-val
      .x-label
        height 22px

      .x-label
      .x-val
        color gray-light

      /*&:nth-child(2n-1)
        .x-info-list-item-in
          margin-right 15px

      &:nth-child(2n)
        .x-info-list-item-in
          margin-left 15px*/
</style>
