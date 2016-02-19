<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 饮食管理
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  import Tab from '../../components/tab.vue';

  export default {
    name: 'Diet',

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
            label: '菜谱管理',
            link: { path: '/diet/recipe' }
          }, {
            label: '食材管理',
            link: { path: '/diet/food' }
          }]
        };
      }
    }
  };
</script>
