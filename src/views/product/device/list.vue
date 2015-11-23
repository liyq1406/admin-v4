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
        span {{filteredDevices.length}}
        | 条结果
      v-select(:options="visibilityOptions", :value="visibility", @select="setVisibility")
        span 显示：

    //- 设备列表
    grid(:data="filteredDevices | filterBy query in 'mac'", :columns="deviceColumns")
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

    route: {
      data: function () {
        return {
          devices: this.fetchDevices(this.$route.params['id'])
        }
      }
    },

    methods: {
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

      fetchDevices: function (productId) {
        var apiUrl = apiRoot + 'product/' + productId + '/devices';
        var self = this;

        return new Promise(function (resolve, reject) {
          return self.$http.get(apiUrl, function (data, status, request) {
            resolve(data);
          }).error(function (data, status, request) {
            reject(data);
          });
        });
      }
    }
  };
</script>