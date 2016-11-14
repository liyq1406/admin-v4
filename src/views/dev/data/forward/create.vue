<template>
  <div class="main">
    <div class="main-title">
      <h2>数据转发</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <forward-form></forward-form>
      </div>
    </div>
  </div>
</template>

<script>
import ForwardForm from './ForwardForm'
export default {
  name: 'Creation',

  components: {
    ForwardForm
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '数据转发',
        link: '/dev/data/forward'
      }, {
        label: '添加转发规则'
      }]
    }
  }
}
</script>
