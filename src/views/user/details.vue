<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2
            a.fa.fa-arrow-circle-left(v-link="{path: '/users'}")
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
            tbody(v-for="subDevlice in subDevlices")
                tr
                  td {{subDevlice.product_id}}
                  //这里使用产品id 不是产品名称 debug
                  td {{subDevlice.mac}}
                  td(v-if="subDevlice.is_online==true") 在线
                  td(v-if="subDevlice.is_online==false") 离线
                  td {{subDevlice.authorize_code}}
      .panel
        .panel-bd
          button.btn.btn-primary.btn-lg.mt10.mb10(@click.prevent="deleteUser") 删除该用户
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

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
        subDevlices:[]//用户绑定设备列表
      }
    },
    route: {
      data: function () {
        var self = this;
        var user_id = window.location.hash.split("/");
        user_id = user_id[user_id.length-1];//获取当前用户id
        api.corp.refreshToken().then(function () {
          api.user.profile(user_id).then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.user=data;
          });

          api.user.subDevliceList(user_id).then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.subDevlices=data;
          });


        });
        return {};
      },


    },

    methods: {
      deleteUser: function () {
        if(confirm("确定要删除当前用户吗？")){
          var user_id = this.user.id;
          api.corp.refreshToken().then(function () {
            api.user.putMember(user_id).then(function (data){
              if(__DEBUG__) {
                console.log(data);
              }
              console.log(data);
            });
          });

        }

      }
    }
  };
</script>