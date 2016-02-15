<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/diet/food'}")
        i.fa.fa-arrow-circle-left
        | 食材管理
    .panel
      .panel-hd
        h2 编辑食材
      .panel-bd edit
</template>

<script>
export default {
  name: 'EditForm',

  data () {
    return {
    };
  },

  methods: {

  }
};
</script>
