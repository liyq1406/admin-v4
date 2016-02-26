<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2(v-text="product.name")
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in", @edit-product-name="getProduct")
</template>

<script>
  import Tab from '../../components/tab.vue';
  import api from '../../api';

  module.exports = {
    name: 'Products',

    components: {
      'tab': Tab
    },

    data: function () {
      return {
        product: {
          name: '',
          description: '',
          id: ''
        },
        secondaryNav: []
      };
    },

    route: {
      data: function (transition) {
        this.getProduct();

        return {
          secondaryNav: [{
            label: this.$t('sub_nav.product.overview'),
            link: { path: '/products/' + this.$route.params.id + '/overview' }
          }, {
            label: this.$t('sub_nav.product.devices'),
            link: { path: '/products/' + this.$route.params.id + '/devices' }
          }, {
            label: this.$t('sub_nav.product.datapoints'),
            link: { path: '/products/' + this.$route.params.id + '/data-point' }
          }, {
            label: this.$t('sub_nav.product.alerts'),
            link: { path: '/products/' + this.$route.params.id + '/alert' }
          // }, {
            // label: '设备互联',
            // link: { path: '/products/' + this.$route.params.id + '/interconnection' }
          }, {
            label: this.$t('sub_nav.product.upgrade'),
            link: { path: '/products/' + this.$route.params.id + '/upgrade' }
          // }, {
            // label: '虚拟设备',
            // link: { path: '/products/' + this.$route.params.id + '/virtual-device' }
          }, {
            label: this.$t('sub_nav.product.wechat'),
            link: { path: '/products/' + this.$route.params.id + '/wechat' }
          }, {
            label: this.$t('sub_nav.product.dataforward'),
            link: { path: '/products/' + this.$route.params.id + '/data-forward' }
          }]
        };
      }
    },

    methods: {
      getProduct: function () {
        var self = this;
        api.corp.refreshToken(this).then(function () {
          api.product.getProduct(self.$route.params.id).then(function (data) {
            self.product = data;
          });
        });
      }
    }

  };
</script>
