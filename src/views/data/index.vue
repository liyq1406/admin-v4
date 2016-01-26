<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 {{ $t("nav_aside.data") }}
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  import Tab from '../../components/tab.vue';

  export default {
    name: 'Data',

    components: {
      'tab': Tab
    },

    data () {
      return {
        secondaryNav: []
      };
    },

    route: {
      data: function () {
        return {
          secondaryNav: [{
            label: this.$t('sub_nav.data.tables'),
            link: { path: '/data/tables' }
          }, {
            label: 'API',
            url: 'http://support.xlink.cn/hc/'
          }]
        };
      }
    }
  };
</script>