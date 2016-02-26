<template lang="jade">
.panel
  .panel-bd
    //- 操作栏
    .action-bar
      search-box(:key.sync="query", :active="searching", :placeholder="$t('overview.addForm.mac_placeholder')", @cancel="getDevices", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch", @press-enter="getDevices")
        button.btn.btn-primary(slot="search-button", @click="getDevices") {{ $t('common.search') }}
      .action-group
        button.btn.btn-success(@click="showAddModal = true")
          i.fa.fa-plus
          | {{ $t("overview.add_device") }}
        label.btn.btn-success.btn-upload(:class="{'disabled':importing}")
          input(type="file", v-el:mac-file, name="macFile", @change.prevent="batchImport")
          i.fa.fa-reply-all
          | {{importing ? $t("common.handling") : $t("overview.import_devices")}}

    //- 状态栏
    .status-bar
      .status {{{ $t('common.total_results', {count:total}) }}}
        //- | 共有
        //- span {{total}}
        //- | 条结果
      v-select(:options="visibilityOptions", :value.sync="visibility", @select="getDevices")
        span {{ $t('common.display') }}：

    //- 设备列表
    //- grid(:data="filteredDevices | filterBy query in 'mac'", :columns="deviceColumns")
    table.table.table-stripe.table-bordered
      thead
        tr
          th(@click="sortBy('mac')", :class="{active: sortKey === 'mac'}")
            | MAC
            i.fa(:class="sortOrders['mac'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'")
          th
            | {{ $t('device.id') }}
          th
            | {{ $t('device.is_active') }}
          th(@click="sortBy('active_date')", :class="{active: sortKey === 'active_date'}")
            | {{ $t('device.active_date') }}
            i.fa(:class="sortOrders['active_date'] ==='asc' ? 'fa-caret-up' : 'fa-caret-down'")
          //-
            th
              | 最近一次登录
          th
            | {{ $t('device.is_online') }}
      tbody
        template(v-if="devices.length > 0 && !loadingData")
          tr(v-for="device in devices")
            td
              a.hl-red(v-link="'/products/' + $route.params.id + '/devices/' + device.id") {{device.mac}}
            td {{device.id}}
            td(v-text="device.is_active ? $t('device_list.active') : $t('device_list.not_active')")
            td
              span(v-if="device.active_date") {{device.active_date | formatDate}}
            //-
              td
                span(v-if="device.last_login") {{device.last_login | formatDate}}
            td
              span.hl-green(v-if="device.is_online") {{ $t('device_list.online') }}
              span.hl-gray(v-else) {{ $t('device_list.offline') }}
        tr(v-if="loadingData")
          td.tac(colspan="5")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span {{ $t("common.data_loading") }}
        tr(v-if="devices.length === 0 && !loadingData")
          td.tac(colspan="5")
            .tips-null
              span {{ $t("common.no_records") }}
    pager(v-if="!loadingData && total > pageCount", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getDevices")

  // 添加设备浮层
  modal(:show.sync="showAddModal")
    h3(slot="header") {{ $t("overview.add_device")}}
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
        .form-row
          label.form-control {{ $t("overview.addForm.mac")}}:
          .controls
            .input-text-wrap(v-placeholder="$t('overview.addForm.mac_placeholder')")
              input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
              span(v-if="addValidation.mac.$error.required") {{ $t('validation.required', {field: $t('overview.addForm.mac')})
            .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
              span(v-if="addValidation.mac.$error.required") {{ $t('validation.required', {field: $t('overview.addForm.mac')})
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  import Vue from 'vue';
  import api from '../../../api';
  import Select from '../../../components/select.vue';
  import Pager from '../../../components/pager.vue';
  import Modal from '../../../components/modal.vue';
  import SearchBox from '../../../components/search-box.vue';
  import locales from '../../../consts/locales';
  import _ from 'lodash';

  module.exports = {
    name: 'DeviceList',

    components: {
      'v-select': Select,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      var sortOrders = {};
      ['active_date'].forEach(function (key) {
        sortOrders[key] = 'desc';
      });

      ['mac'].forEach(function (key) {
        sortOrders[key] = 'asc';
      });

      return {
        query: '',
        sortKey: '',
        sortOrders: sortOrders,
        searching: false,
        visibility: 'all',
        visibilityOptions: locales[Vue.config.lang].visibilityOptions,
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
        importing: false,
        loadingData: false
      };
    },

    computed: {
      queryCondition: function () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: this.sortOrders,
          query: {}
        };

        if (this.query.length > 0) {
          condition.query['mac'] = { $like: this.query };
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

        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.device.getList(self.$route.params.id, self.queryCondition).then(function (data) {
            self.devices = data.list;
            self.total = data.count;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
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
          if (!/text\/\w+/.test(file.type)) {
            alert(file.name + self.$t('upload.type_tips'));
            return false;
          }
          reader.onerror = function (evt) {
            alert(self.$t('upload.read_err'));
          };
          this.importing = true;
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n');
              var a = [];
              macArr.forEach(function (element, index) {
                if (element !== '') {
                  a.push(element);
                }
              });
              macArr = a;
              api.corp.refreshToken().then(function () {
                api.device.batchImport(self.$route.params.id, macArr).then(function (status) {
                  if (status === 200) {
                    alert(self.$t('upload.success_msg'));
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
          alert(self.$t('upload.compatiblity'));
        }
      }
    }
  };
</script>
