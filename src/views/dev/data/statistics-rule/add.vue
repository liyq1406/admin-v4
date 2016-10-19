<template>
  <div class="main">
    <div class="main-title">
      <h2>设备快照</h2>
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
import Breadcrumb from 'components/Breadcrumb'

export default {
  name: 'StatictisRuleDetail',

  components: {
    StatictisRuleForm,
    Breadcrumb
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '统计规则',
        link: '/dev/data/statistics-rule'
      }, {
        label: '添加统计规则'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
