<template>
  <div>
    <x-select width="120px" :label="selectedDatapoint.label" :size="small">
      <select @change="onSelect">
        <option v-for="opt in options" :value="opt">{{ opt.label }}</option>
      </select>
    </x-select>
  </div>
</template>

<script>
  import api from 'api'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'

  export default {
    mixins: [globalMixins],

    components: {
      'x-select': Select
    },

    props: {
      filter: {
        type: Function,
        default () {
          return function () {
            return true
          }
        }
      },
      productId: {
        type: String,
        required: true,
        default: ''
      }
    },

    data () {
      return {
        dataPoints: [],
        selectedDatapoint: {}
      }
    },

    computed: {
      options () {
        let res = []
        if (this.dataPoints.length) {
          this.dataPoints.forEach((item) => {
            res.push({
              value: item.id,
              label: item.name
            })
          })
        }
        return res
      }
    },

    watch: {
      productId () {
        if (this.productId) {
          this.getCurProductDatapoints(this.productId)
        }
      }
    },

    ready () {
      if (this.productId) {
        this.getCurProductDatapoints(this.productId)
      }
    },

    methods: {
      onSelect (value) {
        this.value = value
        this.$emit('select', value)
      },
      // 获取当前产品的数据端点
      getCurProductDatapoints (productId) {
        api.product.getDatapoints(productId).then((res) => {
          if (res.status === 200 && res.data.length) {
            this.dataPoints = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .input-radio-wrap
    position relative
    line-height 30px
    display inline-block
    input, label
      vertical-align middle
    label
      margin-right 20px
</style>
