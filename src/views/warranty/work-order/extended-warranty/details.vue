<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/warranty/work-orders/extended-warranties' }"><i class="fa fa-arrow-circle-left"></i>延保工单列表</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel">
            <div class="panel-hd">
              <h2>工单详情</h2>
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
  import { globalMixins } from '../../../../mixins'

  export default {
    name: 'OrderDetails',

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
  @import '../../../../assets/stylus/common'
</style>
