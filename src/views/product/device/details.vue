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
              h2 数据端点
            .panel-bd
              table.table
          // End: 数据端点

        .col-7
          // Start: 设备日志
          .panel
            .panel-hd
              h2 设备日志
            .panel-bd
              p 设备日志
          // End: 设备日志


</template>

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
</style>

<script>
  var api = require('../../../api');

  module.exports = {
    data: function () {
      return {
        device: {},
        datapoints: []
      };
    },

    route: {
      data: function () {
        return {
          device: this.getDeviceInfo(),
          datapoints: []
        };
      }
    },

    methods: {
      getDeviceInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getInfo(self.$route.params.product_id, self.$route.params.device_id);
        });
      }
    }
  };
</script>
