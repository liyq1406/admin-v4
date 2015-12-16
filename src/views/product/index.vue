<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2(v-text="product.name")
        .panel-bd
          tab(:nav="secondaryNav")
      router-view(class="view", transition="view", transition-mode="out-in", :product.sync="product", keep-alive)
</template>

<script>
  var Tab = require('../../components/tab.vue');
  var api = require('../../api');

  module.exports = {
    components: {
      'tab': Tab
    },

    data: function () {
      return {
        product: {},
        secondaryNav: []
      };
    },

    route: {
      data: function (transition) {
        return {
          product: this.getProduct(),
          secondaryNav: [{
            label: '概览',
            link: { path: '/products/' + this.$route.params.id + '/overview' }
          }, {
            label: '设备管理',
            link: { path: '/products/' + this.$route.params.id + '/devices' }
          }, {
            label: '数据端点',
            link: { path: '/products/' + this.$route.params.id + '/data-point' }
          }, {
            label: '通知与告警',
            link: { path: '/products/' + this.$route.params.id + '/alarm' }
          // }, {
            // label: '设备互联',
            // link: { path: '/products/' + this.$route.params.id + '/interconnection' }
          }, {
            label: '固件升级',
            link: { path: '/products/' + this.$route.params.id + '/upgrade' }
          // }, {
            // label: '虚拟设备',
            // link: { path: '/products/' + this.$route.params.id + '/virtual-device' }
          }]
        };
      }
    },

    methods: {
      getProduct: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getProduct(self.$route.params.id);
        });
      }
    }

  };
</script>
