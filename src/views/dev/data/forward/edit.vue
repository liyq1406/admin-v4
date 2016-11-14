<template>
  <div class="main">
    <div class="main-title">
      <h2>数据转发</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <forward-form type="edit"></forward-form>
      </div>
    </div>
  </div>
</template>

<script>
import ForwardForm from './ForwardForm'
export default {
  name: 'Edit',

  components: {
    ForwardForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '数据转发',
        link: '/dev/data/forward'
      }, {
        label: '编辑转发规则'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
