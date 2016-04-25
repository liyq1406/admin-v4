<template>
  <div :class="classes">
    <slot name="label"></slot>
    <date-picker :size="inputSize" :width="inputWidth" :value.sync="from"></date-picker>
    <span>至</span>
    <date-picker :size="inputSize" :width="inputWidth" :value.sync="to"></date-picker>
  </div>
</template>

<script>
  import DatePicker from './DatePicker'

  export default {
    name: 'DateRangePicker',

    components: {
      'date-picker': DatePicker
    },

    props: {
      // 起始日期
      from: {
        type: String,
        default: '',
        twoWay: true
      },

      // 结束日期
      to: {
        type: String,
        default: '',
        twoWay: true
      },

      // 宽度
      inputWidth: {
        type: String,
        default: '110px'
      },

      // 尺寸
      inputSize: {
        type: String,
        default: 'normal'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'date-range-picker'
      }
    },

    computed: {
      // 类
      classes () {
        var result = [this.classPrefix]
        var sizeCls = ({
          'small': 'sm'
        })[this.inputSize] || ''

        if (sizeCls) {
          result.push(`${this.classPrefix}-${sizeCls}`)
        }

        return result.join(' ')
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .date-range-picker
    display inline-block

  .date-range-picker-sm
    span
      font-size 12px

</style>
