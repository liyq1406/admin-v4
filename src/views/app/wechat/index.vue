<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 {{ '微信应用查看' }}
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>
<script>
  import Tab from '../../../components/tab.vue';

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
        var appId = this.$route.params.id;
        return {
          secondaryNav: [{
            label: '修改微信应用',
            link: { path: '/apps/wechat/' + appId + '/update' }
          }]
        };
      }
    }
  };
</script>
