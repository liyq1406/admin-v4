<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key.sync="query", :active="searching", :placeholder="'请输入 mac 地址'", @search="searchDevices", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
          button.btn.btn-primary(slot="search-button", @click="searchDevices(query)") 搜索
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | 添加设备
          label.btn.btn-success
            input(type="file", v-el:mac-file, name="macFile", @change.prevent="importFile")
            i.fa.fa-reply-all
            | 导入设备
          p {{macFile}}

      //- 状态栏
      .status-bar
        .status
          | 共有
          span {{filteredDevices.length}}
          | 条结果
        v-select(:options="visibilityOptions", :value="visibility", @select="setVisibility")
          span 显示：

      //- 设备列表
      //- grid(:data="filteredDevices | filterBy query in 'mac'", :columns="deviceColumns")
      table.table.table-stripe.table-bordered
        thead
          tr
            th(@click="sortBy('mac')", :class="{active: sortKey === 'mac'}")
              | MAC
              i.fa(:class="sortOrders['mac'] > 0 ? 'fa-caret-up' : 'fa-caret-down'")
            th(@click="sortBy('is_active')", :class="{active: sortKey === 'is_active'}")
              | 是否激活
              i.fa(:class="sortOrders['is_active'] > 0 ? 'fa-caret-up' : 'fa-caret-down'")
            th(@click="sortBy('active_date')", :class="{active: sortKey === 'active_date'}")
              | 激活时间
              i.fa(:class="sortOrders['active_date'] > 0 ? 'fa-caret-up' : 'fa-caret-down'")
            th(@click="sortBy('last_login')", :class="{active: sortKey === 'last_login'}")
              | 最近一次登录
              i.fa(:class="sortOrders['last_login'] > 0 ? 'fa-caret-up' : 'fa-caret-down'")
            th(@click="sortBy('is_online')", :class="{active: sortKey === 'is_online'}")
              | 在线状态
              i.fa(:class="sortOrders['is_online'] > 0 ? 'fa-caret-up' : 'fa-caret-down'")
        tbody
          tr(v-for="device in devices | orderBy sortKey sortOrders[sortKey] | limitBy pageCount (currentPage-1)*pageCount")
            td
              a.hl-red(v-link="'/products/' + $route.params.id + '/devices/' + device.id") {{device.mac}}
            td(v-text="device.is_active ? '是' : '未激活'")
            td {{device.active_date}}
            td {{device.last_login}}
            td
              span.hl-green(v-if="device.is_online") 在线
              span.hl-gray(v-else) 下线
          tr(v-if="filteredDevices.length === 0")
            td.tac(colspan="5")
              i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
              .tips-null(v-else) 未搜索到设备
      pager(:total="filteredDevices.length", :current.sync="currentPage", :page-count="pageCount")
      p {{query | json}}

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
  var Pager = require('../../../components/pager.vue');
  var Modal = require('../../../components/modal.vue');
  var SearchBox = require('../../../components/search-box.vue');
  var fs = require('fs');
  var filters = {
    all: function (devices) {
      return devices;
    },

    online: function (devices) {
      return devices.filter(function (device) {
        return device.is_online === true;
      });
    },

    active: function (devices) {
      return devices.filter(function (device) {
        return device.is_active === true;
      });
    },

    inactive: function (devices) {
      return devices.filter(function (device) {
        return device.is_active === false;
      });
    }
  };

  module.exports = {
    components: {
      'v-select': Select,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      var sortOrders = {};
      ['mac', 'is_active', 'active_date', 'last_login', 'is_online'].forEach(function (key) {
        sortOrders[key] = 1;
      });

      return {
        query: '',
        sortKey: '',
        sortOrders: sortOrders,
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
        pageCount: 10,
        showAddModal: false,
        addModel: {},
        addValidation: {},
        macFile: ''
      }
    },

    computed:  {
      filteredDevices: function () {
        var self = this;
        var visableDevices = filters[this.visibility](this.devices);
        return visableDevices.filter(function (item) {
          return item.mac.match(self.query);
        });
      }
    },

    route: {
      data: function () {
        return {
          devices: this.getDevices()
        };
      }
    },

    methods: {
      getDevices: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.device.getList(self.$route.params.id, {filter:['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login']});
        });
      },

      setVisibility: function (value) {
        this.visibility = value;
      },

      searchDevices: function (query) {
        var self = this;
        this.query = query;
        console.log(self.query);
        if (this.query.length === 0) {
          api.corp.refreshToken().then(function () {
            api.device.getList(self.$route.params.id).then(function (data) {
              self.devices = data;
            });
          });
        } else {
          api.corp.refreshToken().then(function () {
            api.device.getList(self.$route.params.id, {
              query: {
                mac: {
                  $in: [self.query]
                }
              }
            }).then(function (data) {
              self.devices = data;
            });
          });
        }
      },

      sortBy: function (key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
        console.log(this.sortOrders);
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.searchDevices('');
      },

      onAddCancel: function () {
        this.showAddModal = false;
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
              if (error.code === 4001021) {
                alert('该设备 MAC 地址已存在');
              }

              if (__DEBUG__) {
                console.log(status);
              }
            });
          });
        }
      },

      importFile: function () {
        var file = this.$els.macFile;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              console.log(evt.target.result.split(',')[1]);
            }
          };
          reader.readAsText(file);
        } else {
          alert('您的浏览器过于低级，不支持 HTML5 上传');
        }
        // var data = new FormData();
        // data.append('macFile', file);
        // var data = fs.readFileSync(file);
        // console.log(data.toString());
        // console.log(fs);

        // console.log(file);
      }
    }
  };
</script>
