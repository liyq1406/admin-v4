<template>
  <div class="main">
    <div class="main-title">
      <h2>统计规则</h2>
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
        label: '产品统计规则',
        link: '/dev/data/statistics-rule/product'
      }, {
        label: '添加产品统计规则'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
