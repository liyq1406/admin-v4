<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/warranty/accounts/'}"><i class="fa fa-arrow-circle-left"></i>网点列表</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel">
            <div class="panel-hd">
              <h2>网点详情</h2>
            </div>
            <div class="panel-bd">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'AccountDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {}
    },

    methods: {
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
