<template>
  <div class="date-time-single-picker">
    <div class="wrap">
      <button @click.prevent.stop='showTimePicker=!showTimePicker' class="time-range-show" readonly="readonly">{{label === '' ? timeShowPanel: label}}
        <span class="fa fa-sort-down ml10"></span>
      </button>
      <date-time-picker :open.sync='showTimePicker' @timechange='timeChange' :value='time' :show-time='showTime'></date-time-picker>
    </div>
  </div>
</template>

<script>
import formatDate from 'filters/format-date'

export default {
  name: 'DateTimeSinglePicker',

  props: {
    time: {
      type: Date,
      default () {
        return new Date()
      }
    },
    label: {
      type: String,
      default: ''
    },
    showTime: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      showTimePicker: false,
      startTime: new Date(),
      defaultTime: new Date()
    }
  },

  computed: {
    timeShowPanel () {
      let format = this.showTime ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'
      return formatDate(this.startTime, format, true)
    }
  },

  ready () {
    this.startTime = this.time
  },

  watch: {
    time () {
      this.startTime = this.time
    }
  },

  methods: {
    timeChange (microtime) {
      var date = new Date(microtime)
      this.startTime = date
      this.dispatchTime()
    },

    dispatchTime () {
      this.$emit('timechange', this.startTime)
    }
  }
}
</script>

<style lang="stylus" scoped>
.date-time-single-picker
  height 26px
  position relative
  .wrap
    width auto
    position relative
    display inline-block
  .time-range-show
    padding 0px 10px
    line-height 24px
    text-align center
    font-size 12px
    background-color #F8F8F8
    border 1px solid #E4E4E4
    outline none
    span
      line-height 18px
      vertical-align top
</style>
