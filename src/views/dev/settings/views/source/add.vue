<template>
  <div class="main">
    <div class="main-title">
      <h2>自定义数据源</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <statictis-rule-form></statictis-rule-form>
      </div>
    </div>
  </div>
</template>

<script>
import StatictisRuleForm from './form'
export default {
  name: 'StatictisRuleDetail',

  components: {
    StatictisRuleForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '自定义数据源',
        link: '/dev/settings/views/source'
      }, {
        label: '添加数据源'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
