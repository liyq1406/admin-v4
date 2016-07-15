<template>
  <section class="main-wrap">
    <div class="main broadcast-details">
      <div class="breadcrumb"><a v-link="{path: '/plugins/broadcast/history'}"><i class="fa fa-arrow-circle-left"></i>消息推送</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>推送详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li class="row">
              <div class="col-3 label">推送渠道:</div>
              <div class="col-21 info">APP1</div>
            </li>
            <li class="row">
              <div class="col-3 label">推送类型:</div>
              <div class="col-21 info">广播</div>
            </li>
            <li class="row">
              <div class="col-3 label">推送范围:</div>
              <div class="col-21 info">全部人</div>
            </li>
            <li class="row">
              <div class="col-3 label">推送时间:</div>
              <div class="col-21 info">2013-03-04 12:30</div>
            </li>
            <li class="row">
              <div class="col-3 label">过期时间:</div>
              <div class="col-21 info">2013-03-04 12:30</div>
            </li>
            <li class="row">
              <div class="col-3 label">推送标题:</div>
              <div class="col-21 info">推送标题</div>
            </li>
            <li class="row">
              <div class="col-3 label">推送描述:</div>
              <div class="col-21 info">一不小心抽中88888欧洲十日游！妥妥的~</div>
            </li>
            <li class="row">
              <div class="col-3 label">打开消息:</div>
              <div class="col-21 info">打开指定网页  www.google.com</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'BroadcastDetails',

    mixins: [globalMixins],

    data () {
      return {
        history: {}
      }
    }
  }
</script>
