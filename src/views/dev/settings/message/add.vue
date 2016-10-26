<template>
  <div class="main">
    <div class="main-title">
      <h2>添加运营商</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <operator-form></operator-form>
      </div>
    </div>
  </div>
</template>

<script>
import OperatorForm from './OperatorForm'
import Breadcrumb from 'components/Breadcrumb'

export default {
  name: 'Creation',

  components: {
    OperatorForm,
    Breadcrumb
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '运营商列表',
        link: '/dev/settings/message/custom-carrier'
      }, {
        label: '添加运营商'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
