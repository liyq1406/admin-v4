<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 系统设置
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  import Tab from '../../components/tab.vue';

  export default {
    name: 'Settings',

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
            label: '授权管理',
            link: { path: '/settings/auth' }
          }, {
            label: '成员管理',
            link: { path: '/settings/members' }
          }, {
            label: '帐号信息',
            link: { path: '/settings/account' }
          }, {
            label: '邮件模板',
            link: { path: '/settings/mail-templates' }
          }]
        };
      }
    }
  };
</script>
