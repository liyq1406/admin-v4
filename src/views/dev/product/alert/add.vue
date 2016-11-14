<template>
  <div class="main">
    <div class="main-title">
      <h2>告警管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <rule-form type="add"></rule-form>
  </div>
</template>
<script>
import RuleForm from './components/RuleForm'
import { globalMixins } from 'src/mixins'

export default {
  name: 'AddRule',

  mixins: [globalMixins],

  components: {
    RuleForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '全部',
        link: `/dev/products/${this.$route.params.id}/alert`
      }, {
        label: '添加告警规则'
      }]
    }
  }
}
</script>
