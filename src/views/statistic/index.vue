<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 统计分析
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  import Tab from '../../components/tab.vue';

  export default {
    name: 'Statistic',

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
            label: '产品统计',
            link: { path: '/statistic/products' }
          }, {
            label: '用户统计',
            link: { path: '/statistic/users' }
          }]
        };
      }
    }
  };
</script>
