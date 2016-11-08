<template>
  <div>
    <x-select width="120px" :label="selectedDatapoint.label" :size="small">
      <select v-model="selectedDatapoint" @change="onSelect">
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
      },
      defaultItem: {
        type: Object,
        default () {
          return {}
        }
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
              value: item.index,
              label: item.name
            })
          })
        }
        res = _.filter(res, this.filter)
        return res
      }
    },

    watch: {
      productId () {
        if (this.productId) {
          this.getCurProductDatapoints(this.productId)
        }
      },
      filter () {
        if (this.options.length) {
          this.selectedDatapoint = this.options[0]
        } else {
          this.selectedDatapoint = {}
        }
        this.onSelect()
      }
    },

    ready () {
      if (this.productId) {
        this.getCurProductDatapoints(this.productId)
      }
    },

    methods: {
      onSelect () {
        let dpOrigin = _.find(this.dataPoints, (item) => {
          return item.index === this.selectedDatapoint.value
        })
        this.$emit('select', dpOrigin)
      },
      // 获取当前产品的数据端点
      getCurProductDatapoints (productId) {
        api.product.getDatapoints(productId).then((res) => {
          if (res.status === 200 && res.data.length) {
            this.dataPoints = res.data
            if (this.options.length) {
              this.selectedDatapoint = this.options[0]
            }
            this.onSelect()
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
