<template lang="jade">
  section.main-wrap
    .main
      .breadcrumb
        a(v-link="{path: '/products/' + $route.params.product_id + '/devices' }")
          i.fa.fa-arrow-circle-left
          | 设备管理
      .row
        .col-20
          .panel
            .panel-hd
              h2 设备详情
            .panel-bd
              //- #diviceMap(style="height: 300px")
              ul.device-details
                li
                  .label ID：
                  .info {{device.id}}
                li
                  .label MAC：
                  .info {{device.mac}}
                li
                  .label 激活:
                  .info {{device.is_active ? '已激活' : '未激活'}}
                li
                  .label 激活时间：
                  .info {{device.active_date}}
                //- li
                //-   .label 最后一次登录：
                //-   .info 2015-11-12 19:33:22
                li
                  .label 在线状态:
                  .info
                    span.hl-green(v-if="device.is_online") 在线
                    span.hl-red(v-else) 离线
                li
                  .label 固件版本:
                  .info
                    span 1.0

      .row
        .col-13
          // Start: 数据端点
          .panel
            .panel-hd
              .actions
                button.btn.btn-success
                  | 刷新
                  i.fa.fa-refresh
              h2 数据端点
            .panel-bd
              table.table
                thead
                  tr
                    th 索引
                    th 端点ID
                    th 备注
                    th 当前值
                tbody
                  tr(v-for="datapoint in datapoints")
                    td {{$index + 1}}
                    td {{datapoint.name}}
                    td {{datapoint.description}}
                    td 0
                  tr(v-if="datapoints.length === 0")
                    td.tac(colspan="4")
                      i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                      .tips-null(v-else) 暂无端点信息

          // End: 数据端点

        .col-7
          // Start: 设备日志
          .panel
            .panel-hd
              .actions
                switch(:value.sync="showLog")
              h2 设备日志
            .panel-bd
              pre.output-log
                div.log 21:15:20.139 100003563: {"msg":{"type":"PING","resp":true}}
                div.log 21:15:20.138 100003563: {"msg":{"type":"PING","resp":false}}
                div.log 21:14:59.278 100003563: {"msg":{"msg_id":257,"code":0,"type":"SYNC","resp":true}}
                div.log 21:14:59.278 100003563: {"msg":{"device":{"id":100003563,"datapoint":[{"index":5,"5":6941,"value":6941}],"flags":2,"msg_id":257},"type":"SYNC","resp":false}}
                div.log 21:14:56.322 100003563: {"msg":{"msg_id":257,"code":0,"type":"SYNC","resp":true}}
                div.log 21:14:56.321 100003563: {"msg":{"device":{"id":100003563,"datapoint":[{"index":5,"5":7197,"value":7197}],"flags":2,"msg_id":257},"type":"SYNC","resp":false}}
                div.log 21:14:46.073 100003563: {"msg":{"type":"PING","resp":true}}
                div.log 21:14:46.073 100003563: {"msg":{"type":"PING","resp":false}}
                div.log 21:14:25.054 100003563: {"msg":{"type":"PING","resp":true}}
                div.log 21:14:25.054 100003563: {"msg":{"type":"PING","resp":false}}
                div.log 21:14:04.032 100003563: {"msg":{"type":"PING","resp":true}}
                div.log 21:14:04.032 100003563: {"msg":{"type":"PING","resp":false}}
                div.log 21:13:43.693 200: OK
          // End: 设备日志


</template>

<script>
  var api = require('../../../api');
  var Promise = require('promise');
  var Switch = require('../../../components/switch.vue');

  module.exports = {
    components: {
      'switch': Switch
    },

    data: function () {
      return {
        device: {},
        datapoints: [],
        showLog: true
      };
    },

    route: {
      data: function () {
        /*alert(111);
        //百度地图API功能
      	function loadJScript() {
          alert("load js");
          var script = document.createElement("script");

      		script.type = "text/javascript";
      		script.src = "http://api.map.baidu.com/api?v=2.0&ak=iqGzDSunIlUeEK1H8rkRfptH&callback=init";
      		document.body.appendChild(script);
      	}
      	window.init = function() {
          alert("init");
      		var map = new BMap.Map("diviceMap");            // 创建Map实例
      		var point = new BMap.Point(116.404, 39.915); // 创建点坐标
      		map.centerAndZoom(point,15);
      		map.enableScrollWheelZoom();                 //启用滚轮放大缩小
      	}
      	// document.getElementById('diviceMap').addEventListener('load', loadJScript);  //异步加载地图

        // document.addEventListener('load', loadJScript);
        document.addEventListener('load', function (e) {
          alert(1223323);
          // body...
        });
        // window.onload=loadJScript;
        alert(222);*/

        return {
          device: this.getDeviceInfo(),
          datapoints: this.getDatapoints()
        };
      }
    },

    methods: {
      loadMapApi: function () {
        return new Promise(function (resolve, reject) {
        });
      },

      getDeviceInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getInfo(self.$route.params.product_id, self.$route.params.device_id);
        });
      },

      getDatapoints: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getDatapoints(self.$route.params.product_id)
        });
      }
    }
  };
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  ul.device-details
    margin 20px 0

    li
      list-style none
      line-height 32px

      .label
        display inline-block
        width 103px

      .info
        display inline-block

  .output-log
    height 360px
    overflow auto
</style>
