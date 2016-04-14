<template>
  <section class="main-wrap">
    <div class="main">
      <div class="row">
        <div class="col-20">
          <div class="panel">
            <div class="panel-hd">
              <h2>帐号管理</h2>
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
    name: 'AccountList',

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
