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
                th 身份
            tbody
              - for(var i=1; i<=10; i++)
                tr
                  td 德尔玛加湿器
                  td 00113322aabb
                  td
                    if i % 2 === 0
                      span.hl-gray 离线
                    else
                      span.hl-green 在线
                  td admin

      .panel
        .panel-bd
          button.btn.btn-primary.btn-lg.mt10.mb10 删除该用户
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

    .user-details
      .label
          display inline-block
          width 103px
          line-height 43px
      .info
          display inline-block
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
        subDevlice:[]//用户绑定设备列表
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
              //console.log(data);
            }
            self.user=data;
          });

          api.user.subDevliceList(user_id).then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.subDevlice=data;
            console.log(self.subDevlice);
          });


        });
        return {};
      },


    },

    methods: {
      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.setQuery('');
      }
    }
  };
</script>