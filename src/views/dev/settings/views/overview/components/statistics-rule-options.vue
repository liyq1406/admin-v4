<template>
  <div>
    <x-select width="120px" :label="selectedRule.label" :size="small">
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
        statisticsRules: [],
        selectedRule: {}
      }
    },

    computed: {
      options () {
        let res = []
        if (this.statisticsRules.length) {
          this.statisticsRules.forEach((item) => {
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
          this.getCurProductStatisticRules()
        }
      }
    },

    ready () {
      if (this.productId) {
        this.getCurProductStatisticRules()
      }
    },

    methods: {
      onSelect (value) {
        this.value = value
        this.$emit('select', value)
      },
      // 获取当前产品的统计规则
      getCurProductStatisticRules () {
        let params = {
          offset: 0,
          limit: 10000, // 取所有规则
          product_id: [this.productId]
        }
        api.snapshot.getAllStatisticRules(params).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.statisticsRules = res.data.list
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
