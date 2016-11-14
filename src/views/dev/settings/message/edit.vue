<template>
  <div class="main">
    <div class="main-title">
      <h2>编辑运营商</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <operator-form type="edit"></operator-form>
      </div>
    </div>
  </div>
</template>

<script>
import OperatorForm from './OperatorForm'
export default {
  name: 'Edit',

  components: {
    OperatorForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '运营商列表',
        link: '/dev/settings/message/custom-carrier'
      }, {
        label: '编辑运营商'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
