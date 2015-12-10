<template lang="jade">
  section.main-wrap
    .main
      .breadcrumb
        a.fa.fa-arrow-circle-left(v-link="{path: '/users'}")
          | 用户列表
      .panel
        .panel-hd
          h2
            | 用户详情
        .panel-bd
          ul.user-details
            li
              .label 用户id：
              .info {{user.id}}
            li
              .label 企业id：
              .info {{user.corp_id}}
            li
              .label 昵称：
              .info {{user.nickname}}
            li
              .label 用户认证码：
              .info {{user.authorize_code}}
            li
              .label 手机号码：
              .info {{user.phone}}
            li
              .label 创建时间：
              .info {{user.create_date}}
            li
              .label 所在区域ID
              .info {{user.region_id}}
      .panel
        .panel-hd
          h2 绑定设备列表
        .panel-bd
          //- 绑定设备列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 产品名称
                th 设备mac
                th 设备状态
                th 认证码
            tbody
              tr(v-for="subDevice in subDevices")
                td {{subDevice.product_id}}
                //这里使用产品id 不是产品名称 debug
                td {{subDevice.mac}}
                td
                  span(v-if="subDevice.is_online==true") 在线
                  span(v-else) 离线
                td {{subDevice.authorize_code}}
              tr(v-if="subDevices.length === 0")
                td.tac(colspan="4")
                  i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                  .tips-null(v-else) 该用户未绑定任何设备
      .panel
        .panel-bd
          button.btn.btn-primary.btn-lg.mt10.mb10(@click.prevent="deleteUser") 停用该用户
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

  .user-details
    padding 20px 0
</style>
<script>
  var api = require('../../api');

  module.exports = {
    components: {
      'api': api
    },

    data: function () {
      return {
        user: {},//用户信息
        subDevices: []//用户绑定设备列表
      }
    },

    route: {
      data: function () {
        return {
          user: this.getUserInfo(),
          subDevices: this.getSubDevices()
        };
      }
    },

    methods: {
      getUserInfo: function () {
        var self = this;

        return api.corp.refreshToken().then(function () {
          return api.user.profile(self.$route.params.id);
        });
      },

      getSubDevices: function () {
        var self = this;

        return api.corp.refreshToken().then(function () {
          return api.user.subDeviceList(self.$route.params.id);
        });
      },

      deleteUser: function () {
        if(confirm("确定要停用当前用户吗？")){
          var user_id = this.user.id;
          api.corp.refreshToken().then(function () {
            api.user.putMember(user_id).then(function (data){
              if(__DEBUG__) {
                console.log(data);
              }
            });
          });
        }
      }
    }
  };
</script>
