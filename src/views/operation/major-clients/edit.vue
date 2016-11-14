<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.user.major.edit') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <statictis-rule-form type="edit"></statictis-rule-form>
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
      breadcrumbNav: []
    }
  },
  ready () {
    this.breadcrumbNav = [{
      label: this.$t('operation.user.major.main_title'),
      link: '/operation/major-clients'
    }, {
      label: this.$t('operation.user.major.edit')
    }]
  }
}
</script>

<style lang="stylus">
</style>
