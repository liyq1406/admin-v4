<template>
  <div>
    <x-select width="120px" :label="selectedRule.label" :size="small">
      <select v-model="selectedRule" @change="onSelect">
        <option v-for="opt in options" :value="opt">{{ opt.label }}</option>
      </select>
    </x-select>
  </div>
</template>

<script>
  import api from 'api'
  import Select from 'components/Select'
  import { globalMixins } from 'src/mixins'
  import _ from 'lodash'

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
      },
      defaultItem () {
        this.selectedRule = this.defaultItem
      }
    },

    ready () {
      if (this.productId) {
        this.getCurProductStatisticRules()
      }
    },

    methods: {
      onSelect () {
        let ruleOrigin = _.find(this.statisticsRules, (item) => {
          return item.id === this.selectedRule.value
        })
        this.$emit('select', ruleOrigin)
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
            this.selectedRule = this.options[0]
          } else {
            this.selectedRule = {}
            this.statisticsRules = []
          }
          this.onSelect()
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
