<template>
  <div :class="classes">
    <slot name="label"></slot>
    <date-picker :size="inputSize" :width="inputWidth" :value.sync="from"></date-picker>
    <v-select width="40px" size="small" class="mr0" :label="fromTime" v-show="from">
      <select v-model="fromTime" @change="selectTime">
        <option :value="timeValue(n)" v-for="n in 24">{{ timeValue(n) }}</option>
      </select>
    </v-select>
    <span>至</span>
    <date-picker :size="inputSize" :width="inputWidth" :value.sync="to"></date-picker>
    <v-select width="40px" size="small" class="mr0" :label="toTime" v-show="to">
      <select v-model="toTime" @change="selectTime">
        <option :value="timeValue(n)" v-for="n in 24">{{ timeValue(n) }}</option>
      </select>
    </v-select>
  </div>
</template>

<script>
  import DatePicker from './DatePicker'
  import Select from './Select'

  export default {
    name: 'DateRangePicker',

    components: {
      'date-picker': DatePicker,
      'v-select': Select
    },

    props: {
      // 起始日期
      from: {
        type: String,
        default: '',
        twoWay: true
      },

      // 起始日期
      fromTime: {
        type: String,
        default: '00:00',
        twoWay: true
      },

      // 结束日期
      to: {
        type: String,
        default: '',
        twoWay: true
      },

      // 结束日期
      toTime: {
        type: String,
        default: '23:00',
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

  .date-range-picker
    display inline-block

  .date-range-picker-sm
    span
      font-size 12px

</style>
