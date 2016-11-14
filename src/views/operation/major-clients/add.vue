<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.user.major.new') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt20">
      <div class="panel-bd">
        <client-form></client-form>
      </div>
    </div>
  </div>
</template>

<script>
import ClientForm from './form'
export default {
  name: 'add-vip-client',

  components: {
    ClientForm
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
      label: this.$t('operation.user.major.new')
    }]
  }
}
</script>

<style lang="stylus">
</style>
