<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a.fa.fa-arrow-circle-left(v-link="{path: '/users'}") {{ $t('user.list') }}
    .panel
      .panel-hd
        h2 {{ $t('user.details') }}
      .panel-bd
        ul.user-details
          li
            .label {{ $t('user.fields.id') }}:
            .info {{user.id}}
          li
            .label 企业ID:
            .info {{user.corp_id}}
          li
            .label {{ $t('user.fields.nick_name') }}:
            .info {{user.nickname}}
          li
            .label {{ $t('user.fields.authorize_code') }}:
            .info {{user.authorize_code}}
          li
            .label {{ $t('user.fields.phone') }}:
            .info {{user.phone}}
          li
            .label {{ $t('user.fields.create_time') }}:
            .info {{user.create_date | formatDate}}
          li
            .label {{ $t('user.fields.region_id') }}:
            .info {{user.region_id}}
    .panel
      .panel-hd
        h2 {{ $t('user.devices_bound') }}
      .panel-bd
        //- 绑定设备列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th {{ $t('user.product_name') }}
              th {{ $t('user.device_mac') }}
              th {{ $t('user.device_status') }}
              th {{ $t('user.device_authorize_code') }}
          tbody
            tr(v-for="subDevice in subDevices")
              td {{subDevice.product_id}}
              //这里使用产品id 不是产品名称 debug
              td {{subDevice.mac}}
              td
                span(v-if="subDevice.is_online==true") {{ $t('common.online') }}
                span(v-else) {{ $t('common.offline') }}
              td {{subDevice.authorize_code}}
            tr(v-if="subDevices.length === 0")
              td.tac(colspan="4")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) {{ $t('user.no_devices_bound') }}
    .panel
      .panel-bd
        //- button.btn.btn-primary.btn-lg.mt10.mb10(@click.prevent="deleteUser") {{ $t('user.ban_user') }}
        button.btn.sxten(:class="{'btn-primary': user.status-0===1, 'btn-success': user.status-0===2, 'disabled': toggling}", :disabled="toggling", @click="toggleMember(user)")
          i.fa(:class="{'fa-stop': user.status, 'fa-play': !user.status}")
          | {{user.status-0===1 ? '停用' : '启用'}}

</template>

<script>
  import api from '../../api';

  module.exports = {
    name: 'UserDetails',

    components: {
      'api': api
    },

    data: function () {
      return {
        user: {}, // 用户信息
        subDevices: [] // 用户绑定设备列表
      };
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
        if (confirm('确定要停用当前用户吗？')) {
          var user_id = this.user.id;
          api.corp.refreshToken().then(function () {
            api.user.putMember(user_id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      // 新版切换状态
      toggleMember: function (user) {
        var self = this;
        if (!this.toggling) {
          this.toggling = true;
          api.corp.refreshToken().then(function () {
            api.user.toggleMember(user.id, user.status - 0 === 1 ? 2 : 1)
            .then(function (data) {
              // self.getTasks();
              if (data === 200) {
                user.status = user.status - 0 === 1 ? 2 : 1;
              }
              self.toggling = false;
            }).catch(function (error) {
              self.handleError(error);
              self.toggling = false;
            });
          });
        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
.sxten
  margin-top 10px
  margin-bottom 10px
</style>
