<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key.sync="query", :active="searching", :placeholder="'请输入 mac 地址'", @cancel="getDevices", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch")
          button.btn.btn-primary(slot="search-button", @click="getDevices") 搜索
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | 添加设备
          label.btn.btn-success.btn-upload(:class="{'disabled':importing}")
            input(type="file", v-el:mac-file, name="macFile", @change.prevent="batchImport")
            i.fa.fa-reply-all
            | {{importing ? '处理中...' : '导入设备'}}

      //- 状态栏
      .status-bar
        .status
          | 共有
          span {{total}}
          | 条结果
        v-select(:options="visibilityOptions", :value.sync="visibility", @select="getDevices")
          span 显示：

      //- 设备列表
      //- grid(:data="filteredDevices | filterBy query in 'mac'", :columns="deviceColumns")
      table.table.table-stripe.table-bordered
        thead
          tr
            th(@click="sortBy('mac')", :class="{active: sortKey === 'mac'}")
              | MAC
              i.fa(:class="sortOrders['mac'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'")
            th
              | 是否激活
            th
              | 激活时间
            th
              | 最近一次登录
            th
              | 在线状态
        tbody
          tr(v-for="device in devices")
            td
              a.hl-red(v-link="'/products/' + $route.params.id + '/devices/' + device.id") {{device.mac}}
            td(v-text="device.is_active ? '是' : '未激活'")
            td
              span(v-if="device.active_date") {{device.active_date | formatDate}}
            td
              span(v-if="device.last_login") {{device.last_login | formatDate}}
            td
              span.hl-green(v-if="device.is_online") 在线
              span.hl-gray(v-else) 下线
          tr(v-if="devices.length === 0")
            td.tac(colspan="5")
              i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
              .tips-null(v-else) 未搜索到设备
      pager(:total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getDevices")

    // 添加设备浮层
    modal(:show.sync="showAddModal")
      h3(slot="header") 添加设备
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
          .form-row
            label.form-control MAC地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入MAC地址'")
                input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required, lazy)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
              .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'")
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

  module.exports = {
    components: {
      'v-select': Select,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      var sortOrders = {};
      ['mac'].forEach(function (key) {
        sortOrders[key] = 'asc';
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
        total: 0,
        currentPage: 1,
        pageCount: 10,
        showAddModal: false,
        addModel: {
          mac: ''
        },
        addValidation: {},
        originAddModel: {},
        adding: false,
        importing: false
      }
    },

    computed:  {
      queryCondition: function () {
        var condition = {
          filter:['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: this.sortOrders,
          query: {}
        };

        if (this.query.length > 0) {
          condition.query['mac'] = { $in: [this.query] };
        }

        switch (this.visibility) {
          case 'online':
            condition.query['is_online'] = { $in: [true] };
            break;
          case 'active':
            condition.query['is_active'] = { $in: [true] };
            break;
          case 'inactive':
            condition.query['is_active'] = { $in: [false] };
            break;
          default:
        }

        return condition;
      }
    },

    route: {
      data: function () {
        this.originAddModel = _.clone(this.addModel);
        this.getDevices();
      }
    },

    methods: {
      // 获取设备列表
      getDevices: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.device.getList(self.$route.params.id, self.queryCondition).then(function (data) {
            self.devices = data.list;
            self.total = data.count;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      // 搜索
      handleSearch: function () {
        if (this.query.length === 0) {
          this.getDevices();
        }
      },

      // 排序
      sortBy: function (key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc';
        this.getDevices();
      },

      // 切换搜索
      toggleSearching: function () {
        this.searching = !this.searching;
      },

      // 取消搜索
      cancelSearching: function () {
        var self = this;
        this.getDevices();
      },

      // 添加表单钩子
      addFormHook: function (form) {
        this.addForm = form;
      },

      // 关闭添加浮层并净化添加表单
      resetAdd: function () {
        var self = this;
        this.adding = false;
        this.showAddModal = false;
        this.addModel = _.clone(this.originAddModel);
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      // 添加操作
      onAddSubmit: function () {
        var self = this;

        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.device.add(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetAdd();
              self.getDevices();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 批量导入
      batchImport: function () {
        var self = this;
        var file = this.$els.macFile.files[0];
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          if(!/text\/\w+/.test(file.type)){
            alert(file.name + '不是文本文件不能上传');
            return false;
          }
          reader.onerror = function (evt) {
            alert('文件读取失败。')
          }
          this.importing = true;
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              var macArr = evt.target.result.split('\n');
              api.corp.refreshToken().then(function () {
                api.device.batchImport(self.$route.params.id, macArr).then(function (status) {
                  if (status === 200) {
                    alert('设备导入成功!')
                    self.getDevices();
                  }
                  self.importing = false;
                }).catch(function (error) {
                  self.handleError(error);
                  self.importing = false;
                });
              });
            }
          };
          reader.readAsText(file);
        } else {
          alert('您的浏览器过于低级，不支持 HTML5 上传');
        }
      }
    }
  };
</script>
