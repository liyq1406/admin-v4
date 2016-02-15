<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/diet/food'}")
        i.fa.fa-arrow-circle-left
        | 食材管理
    .panel
      .panel-hd
        h2 添加食材
      .panel-bd edit
</template>

<script>
export default {
  name: 'AddForm',

  data () {
    return {
    };
  },

  methods: {

  }
};
</script>
