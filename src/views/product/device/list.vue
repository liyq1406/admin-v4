<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key="query", :active="searching", :placeholder="'请输入 mac 地址'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
        .action-group
          button.btn.btn-default
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
            td {{device.mac}}
            td {{device.is_active}}
            td {{device.active_date}}
            td {{device.active_code}}
            //- td {{device.is_online}}
      .pager.tar
        button.pager-btn.pager-prev
          i.fa.fa-chevron-left
        input.pager-input(type="text")
        button.pager-btn.pager-next
          i.fa.fa-chevron-right
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
      'search-box': SearchBox
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

    ready: function () {
      var self = this;
      api.corp.refreshToken().then(function () {
        api.device.getList(self.$route.params.id, {filter:['mac', 'is_active', 'active_date', 'active_code']}).then(function (data) {
          self.devices = data;
        });
      });
    },

    /*
    route: {
      data: function () {
        // devices: this.fetchDevices(this.$route.params['id'])
        devices: this.getDevices()

      }
    },*/

    methods: {
      getDevices: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getList(self.$route.params.id);
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
      }
    }
  };
</script>
