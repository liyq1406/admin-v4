<template>
  <div class="main">
    <div class="main-title">
      <h2>设备快照</h2>
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
import Breadcrumb from 'components/Breadcrumb'

export default {
  name: 'Edit',

  components: {
    ForwardForm,
    Breadcrumb
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '设备快照',
        link: '/dev/data/snapshots'
      }, {
        label: '编辑快照'
      }]
    }
  }
}
</script>

<style lang="stylus">
</style>
