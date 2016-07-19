<template>
  <div class="date-time-single-picker">
    <div class="wrap">
      <button @click='showTimePicker=!showTimePicker' class="time-range-show" readonly="readonly">{{timeShowPanel}}
        <span class="fa fa-sort-down ml10"></span>
      </button>
      <date-time-picker :open.sync='showTimePicker' @timechange='timeChange' :value='defaultTime' :show-time='showTime'></date-time-picker>
    </div>
  </div>
</template>

<script>
import DateTimePicker from 'components/DateTimePicker'
import Dropdown from 'components/Dropdown'
import {uniformDate, uniformMinuteTime} from '../filters'

export default {
  name: 'timerangepicker',
  components: {
    DateTimePicker,
    Dropdown
  },
  props: {
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
      if (this.showTime) {
        return uniformDate(this.startTime) + ' ' + uniformMinuteTime(this.startTime)
      } else {
        return uniformDate(this.startTime)
      }
    }
  },
  ready () {
  },
  methods: {
    timeChange (microtime) {
      var date = new Date(microtime)
      this.startTime = date
      this.dispatchTime()
    },
    dispatchTime () {
      this.showTimePicker = false
      this.$dispatch('timechange', this.startTime)
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
