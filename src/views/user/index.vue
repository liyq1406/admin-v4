<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 用户管理
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
            label: '用户列表',
            link: { path: '/users/list' }
          }, {
            label: '用户设置',
            link: { path: '/users/usersetting' }
          }]
        };
      }
    }
  };
</script>
