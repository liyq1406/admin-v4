<template>
  <div :class="classes">
    <x-select width="80px" :label="value">
      <select v-model="value" @change="selectTime">
        <option :value="timeValue(n)" v-for="n in 24">{{ timeValue(n) }}</option>
      </select>
    </x-select>
  </div>
</template>

<script>
  import Select from './Select'

  export default {
    name: 'TimePicker',

    props: {
      // 值
      value: {
        type: String,
        twoWay: true
      },

      // 尺寸
      // 可选：['small' | 'normal' | 'large'], 默认为 'normal'
      size: {
        type: String,
        default: 'normal'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'time-picker'
      }
    },

    components: {
      'x-select': Select
    },

    computed: {
      // 类
      classes () {
        var result = [this.classPrefix]
        var sizeCls = ({
          'small': 'sm'
        })[this.size] || ''

        if (sizeCls) {
          result.push(`${this.classPrefix}-${sizeCls}`)
        }

        return result.join(' ')
      }
    },

    methods: {
      selectTime () {
        this.$dispatch('select-time')
      },

      timeValue (n) {
        return n < 10 ? `0${n}:00` : `${n}:00`
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .time-picker
    display inline-block
    position relative
    vertical-align middle
</style>
