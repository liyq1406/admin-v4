<template>
  <div class="main">
    <div class="main-title">
      <h2>设备快照</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <snapshot-form type="edit"></snapshot-form>
      </div>
    </div>
  </div>
</template>

<script>
import SnapshotForm from './SnapshotForm'
export default {
  name: 'Edit',

  components: {
    SnapshotForm
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
