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
                switch(:value.sync="showLog", @switch-toggle='toggleLog')
              h2 设备日志
            .panel-bd
              pre.output-log
                div.log(v-for="log in logs")
                  span.time {{log.time}}
                  template(v-if="log.type === 'user'")
                    span.user {{log.msg[0]}}
                    span.msg : {{log.msg[1]}}
                  template(v-if="log.type === 'status'")
                    span(:class="{'msg-success':log.msg[0]===200, 'msg-error':log.msg[0]!==200}") {{log.msg[0]}}
                    span.msg : {{log.msg[1]}}
                  template(v-if="log.type === 'connected'")
                    span.msg-success {{log.msg}}
                  template(v-if="log.type === 'disconnected'")
                    span.msg-error {{log.msg}}

                //-
                  div.log
                    span.time 21:15:20.139
                    span.msg-success Client has connected to the server!
                  div.log
                    span.time 21:15:20.139
                    span.user 100003563
                    span.msg : {"msg":{"type":"PING","resp":true}}
                  div.log
                    span.time 21:15:20.139
                    span.msg-error 400
                    span.msg : Error
                  div.log
                    span.time 21:15:20.139
                    span.msg-success 200
                    span.msg : OK
                  div.log
                    span.time 21:15:20.139
                    span.msg-error The client has disconnected!
          // End: 设备日志


</template>

<script>
  var api = require('../../../api');
  var Promise = require('promise');
  var Switch = require('../../../components/switch.vue');
  var io = require('socket.io-client');
  var dateFormat = require('date-format');
  var socket= null;

  module.exports = {
    components: {
      'switch': Switch
    },

    data: function () {
      return {
        device: {},
        datapoints: [],
        showLog: true,
        deviceToken: '',
        datapointValues: [],
        logs: [],
        token: ''
      };
    },

    route: {
      data: function () {
        var self = this;

        this.getDatapointValues();



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
      },

      activate: function () {
        console.log(222);
        if (this.showLog) {
          this.connect();
        }
      },

      deactivate: function () {
        console.log(11111);
        socket.disconnect();
        socket = null;
      }
    },

    detroyed: function  () {
    },

    methods: {
      getDeviceInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getInfo(self.$route.params.product_id, self.$route.params.device_id);
        });
      },

      getDatapoints: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getDatapoints(self.$route.params.product_id);
        });
      },

      getDatapointValues: function () {
        var self = this;
        api.corp.refreshToken(this).then(function () {
          api.device.getDatapointValues(self.$route.params.device_id).then(function (data) {
            self.datapointValues = data.datapoint;
          });
        });
      },

      connect: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.device.getDeviceToken(self.$route.params.device_id).then(function (data) {

            console.log(data.addr);
            console.log(socket);
            self.token = data.token;
            socket = io.connect('http://' + data.addr, {'force new connection': true});
            // socket = io.connect('http://192.168.6.240:23775');
            console.log(socket);

            socket.on('connect', function() {
              self.outputLog('Client has connected to the server!', 'connected');
              // socket.emit('trace.logs', {id: self.$route.params.device_id, token: data.token});
              window.setTimeout(function  () {
                socket.emit('trace.logs', {id: self.$route.params.device_id, token: self.token});
              }, 100);
        	  });

            socket.on('disconnect', function() {
              self.outputLog('The client has disconnected!', 'disconnected');
        	  });

            socket.on('trace.log', function(data) {
              self.outputLog([data.id, data.log], 'user');
            });

            socket.on('trace.status', function(data) {
              self.outputLog([data.status, data.msg], 'status');
          	});

            /*
            window.setTimeout(function  () {
              socket.emit('trace.logs', {id: self.$route.params.device_id, token: self.token});
            }, 1000);*/
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      outputLog: function (msg, type) {
        this.logs.push({
          time: dateFormat('hh:mm:ss.SSS', new Date()),
          msg: msg,
          type: type
        });
      },

      toggleLog: function () {
        if (!this.showLog) {
          this.connect();
          // socket.emit('trace.logs', {id: this.$route.params.device_id, token: this.token});
        } else {
          // socket.emit('trace.logs', {id: this.$route.params.device_id, token: this.token});
          if (socket) {
            socket.disconnect();
            socket = null;
          }
        }
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

    .time
      margin-right 10px
      color #999

    .user
      color orange

    .msg
      color #333

    .msg-error
      color red

    .msg-success
      color green
</style>
