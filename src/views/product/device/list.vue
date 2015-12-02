<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key="query", :active="searching", :placeholder="'请输入 mac 地址'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
        .action-group
          button.btn.btn-default(@click="showAddModal = true")
            i.fa.fa-plus
            | 添加设备
          button.btn.btn-default
            i.fa.fa-reply-all
            | 导入设备

      //- 状态栏
      .status-bar
        .status
          | 共有
          span 10
          | 条结果
        v-select(:options="visibilityOptions", :value="visibility", @select="setVisibility")
          span 显示：

      //- 设备列表
      //- grid(:data="filteredDevices | filterBy query in 'mac'", :columns="deviceColumns")
      table.table.table-stripe.table-bordered
        thead
          tr
            th MAC
            th 是否激活
            th 激活时间
            th 激活码
            //- th 在线状态
        tbody
          tr(v-for="device in devices")
            td
              a.hl-red(v-link="{path: device.id, append: true}") {{device.mac}}
            td {{device.is_active}}
            td {{device.active_date}}
            td {{device.active_code}}
            //- td {{device.is_online}}
      pager(:total="129", :current.sync="currentPage")

    // 添加设备浮层
    modal(:show.sync="showAddModal")
      h3(slot="header") 添加设备
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
          .form-row
            label.form-control MAC地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入MAC地址'")
                input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
              .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .status-bar
    border 1px solid #E4E4E4
    background #F9F9F9
    padding 5px 20px
    margin-bottom 10px
    clearfix()

    .status
      float right
      font-size 12px
      line-height 25px

      span
        font-weight bold
        color red
</style>

<script>
  var api = require('../../../api');
  var Select = require('../../../components/select.vue');
  var Grid = require('../../../components/grid.vue');
  var Pager = require('../../../components/pager.vue');
  var Modal = require('../../../components/modal.vue');
  var SearchBox = require('../../../components/search-box.vue');
  var filters = {
    all: function (devices) {
      return devices;
    },

    online: function (devices) {
      return devices.filter(function (device) {
        return device.online === true;
      });
    },

    active: function (devices) {
      return devices.filter(function (device) {
        return device.active === true;
      });
    },

    inactive: function (devices) {
      return devices.filter(function (device) {
        return device.active === false;
      });
    }
  };

  module.exports = {
    components: {
      'v-select': Select,
      'grid': Grid,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      return {
        query: '',
        searching: false,
        visibility: 'all',
        visibilityOptions: [
          { label: '全部', value: 'all' },
          { label: '在线', value: 'online' },
          { label: '激活', value: 'active' },
          { label: '未激活', value: 'inactive' }
        ],
        devices: [],
        currentPage: 1,
        showAddModal: false,
        addModel: {},
        addValidation: {},
        deviceColumns: [{
          key: 'mac',
          label: 'MAC'
        }, {
          key: 'active',
          label: '是否激活'
        }, {
          key: 'activate_at',
          label: '激活时间'
        }, {
          key: 'last_login',
          label: '最近一次登录'
        }, {
          key: 'online',
          label: '在线状态'
        }]
      }
    },

    computed:  {
      filteredDevices: function () {
        if (this.visibility.length === 0) {
          return this.devices;
        }

        return filters[this.visibility](this.devices);
      }
    },
    /*
    ready: function () {
      var self = this;
      api.corp.refreshToken().then(function () {
        api.device.getList(self.$route.params.id, {filter:['mac', 'is_active', 'active_date', 'active_code']}).then(function (data) {
          self.devices = data;
        });
      });
    },*/

    route: {
      data: function () {
        // devices: this.fetchDevices(this.$route.params['id'])
        return {
          devices: this.getDevices()
        };
      }
    },

    methods: {
      getDevices: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getList(self.$route.params.id, {filter:['id', 'mac', 'is_active', 'active_date', 'active_code']});
        });
      },

      setVisibility: function (value) {
        this.visibility = value;
      },

      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.setQuery('');
      },

      onAddCancel: function () {

      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.device.add(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.addModel = {};
              self.showAddModal = false;
              self.getDevices().then(function (data) {
                self.devices = data;
              });
            }).catch(function (error) {
              console.log(error);
            });
          });
        }
      }
    }
  };
</script>
