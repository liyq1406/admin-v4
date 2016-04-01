<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/products/' + $route.params.product_id + '/devices' }")
        i.fa.fa-arrow-circle-left
        | {{ $t('device.management') }}
    .row
      .col-20
        .panel
          .panel-hd
            h2 {{ $t('device.details') }}
          .panel-bd
            //- #diviceMap(style="height: 300px")
            ul.device-details
              li(v-if='device.name')
                .label 设备名称:
                .info {{device.name}}
              li
                .label ID:
                .info {{device.id}}
              li
                .label MAC:
                .info {{device.mac}}
              li
                .label {{ $t('device.is_active') }}:
                .info {{device.is_active ? $t('device.active') : $t('device.not_active') }}
              li
                .label {{ $t('device.active_date') }}:
                .info {{device.active_date | formatDate}}
              //- li
              //-   .label 最后一次登录：
              //-   .info 2015-11-12 19:33:22
              li
                .label {{ $t('device.is_online') }}:
                .info
                  span.hl-green(v-if="device.is_online") {{ $t('common.online') }}
                  span.hl-red(v-else) {{ $t('common.offline') }}
              li
                .label {{ $t('device.firmware_version') }}:
                .info
                  span {{device.firmware_version}}

    .row
      .col-13
        // Start: 数据端点
        .panel
          .panel-hd
            .actions
              button.btn.btn-success(:disabled="!device.is_online || refreshing", :class="{'disabled':!device.is_online || refreshing}", @click="getDatapointValues")
                | {{ $t('common.refresh') }}
                i.fa.fa-refresh(:class="{'fa-spin':refreshing}")
            h2 {{ $t('device.datapoint') }}
          .panel-bd
            table.table
              thead
                tr
                  th {{ $t('datapoint.fields.index') }}
                  th {{ $t('datapoint.fields.name') }}
                  th {{ $t('datapoint.fields.description') }}
                  th {{ $t('device.current_value') }}
              tbody
                tr(v-for="datapoint in datapoints | orderBy 'index'")
                  td {{datapoint.index}}
                  td {{datapoint.name}}
                  td {{datapoint.description}}
                  td {{datapointValues[$index] ? datapointValues[$index].value : ''}}
                tr(v-if="datapoints.length === 0")
                  td.tac(colspan="4")
                    i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                    .tips-null(v-else) {{ $t('device.no_datapoint') }}

        // End: 数据端点

      .col-7
        // Start: 设备日志
        .panel
          .panel-hd
            .actions
              switch(:value.sync="showLog", @switch-toggle='toggleLog')
            h2 {{ $t('device.log') }}
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
        // End: 设备日志
</template>

<script>
  import api from '../../../api';
  import Switch from '../../../components/switch.vue';
  import io from 'socket.io-client';
  import dateFormat from 'date-format';
  var socket = null;

  module.exports = {
    name: 'DeviceDetails',

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
        token: '',
        refreshing: false
      };
    },

    route: {
      data: function () {
        this.getDatapointValues();

        /* alert(111);
        //百度地图API功能
      	function loadJScript() {
          alert("load js");
          var script = document.createElement("script");

      		script.type = "text/javascript";
      		script.src = "http://api.map.baidu.com/api?v=2.0&ak=iqGzDSunIlUeEK1H8rkRfptH&callback=init";
      		document.body.appendChild(script);
      	}
      	window.init = function () {
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
        if (this.showLog) {
          this.connect();
        }
      },

      deactivate: function () {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      }
    },

    ready: function () {
      /*
      //百度地图API功能
      function loadJScript() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=iqGzDSunIlUeEK1H8rkRfptH&callback=init";
        document.body.appendChild(script);
      }
      window.init = function () {
        var map = new BMap.Map("diviceMap");            // 创建Map实例
        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
        map.centerAndZoom(point,15);
        map.enableScrollWheelZoom();                 //启用滚轮放大缩小
      }
      // document.getElementById('diviceMap').addEventListener('load', loadJScript);  //异步加载地图

      // document.addEventListener('load', loadJScript);
      // document.addEventListener('load', function (e) {
        // alert(1223323);
        // body...
      // });
      window.onload=loadJScript;
      */
    },

    methods: {
      // 获取设备信息
      getDeviceInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getInfo(self.$route.params.product_id, self.$route.params.device_id);
        });
      },

      // 获取设备端点列表
      getDatapoints: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getDatapoints(self.$route.params.product_id);
        });
      },

      // 获取设备端点值
      getDatapointValues: function () {
        var self = this;
        this.refreshing = true;
        api.corp.refreshToken(this).then(function () {
          api.device.getDatapointValues(self.$route.params.device_id).then(function (data) {
            self.refreshing = false;
            if (data.status === 202) {
              console.log('设备离线！');
            } else {
              self.datapointValues = data.datapoint;
            }
          }).catch(function () {
            self.refreshing = false;
          });
        });
      },

      // 连接
      connect: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.device.getDeviceToken(self.$route.params.device_id).then(function (data) {

            self.token = data.token;
            socket = io.connect('http://' + data.addr, {'force new connection': true});

            // 连接 socket
            socket.on('connect', function () {
              self.outputLog('Client has connected to the server!', 'connected');
              window.setTimeout(function () {
                socket.emit('trace.logs', {id: self.$route.params.device_id, token: self.token});
              }, 100);
            });

            // 断开 socket 连接
            socket.on('disconnect', function () {
              self.outputLog('The client has disconnected!', 'disconnected');
            });

            // 输入日志
            socket.on('trace.log', function (data) {
              self.outputLog([data.id, data.log], 'user');
            });

            // 输出状态
            socket.on('trace.status', function (data) {
              self.outputLog([data.status, data.msg], 'status');
            });
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      // 收集日志信息并格式化输出
      outputLog: function (msg, type) {
        this.logs.push({
          time: dateFormat('hh:mm:ss.SSS', new Date()),
          msg: msg,
          type: type
        });
      },

      // 切换日志显示
      toggleLog: function () {
        if (!this.showLog) {
          this.connect();
        } else {
          if (socket) {
            socket.disconnect();
            socket = null;
          }
        }
      },

      handleError: function (error) {
        console.log(error);
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
