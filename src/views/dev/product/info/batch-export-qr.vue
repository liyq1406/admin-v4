<template>
  <div class="">
    <modal :show.sync="show" width="700px">
      <h3 slot="header">批量导出二维码</h3>
      <div slot="body" class="">
        <div class="flow2-wrap">
          <flow2 :curr="currStep" :steps="steps"></flow2>
        </div>
        <component :is="currentView"></component>
      </div>
    </modal>
  </div>
</template>

<script>
  import Modal from 'components/Modal'
  import Flow2 from 'components/Flow2'
  import FilterDevice from './components/filter-device'

  export default {
    components: {
      Modal,
      Flow2,
      FilterDevice
    },
    props: {
      show: {
        type: Boolean,
        default: false,
        twoway: true
      }
    },
    data () {
      return {
        currStep: 1,
        steps: ['筛选设备', '自定义二维码', '批量导出']
      }
    },
    computed: {
      currentView () {
        if (this.currStep === 1) {
          return 'filter-device'
        }
      }
    },
    ready () {},
    attached () {},
    methods: {}
  }
</script>

<style lang="stylus">
  .modal-header
    border-bottom none !important
    h3
      margin-top 10px !important
      text-indent 20px
      font-size 18px
      color #666666 !important
  .flow2-wrap
    padding 0 60px
</style>
