<template>
  <div class="time-range-picker-wrap">
    <button @click='showChoosePanel=!showChoosePanel' class="time-range-show" readonly="readonly">{{timeShowPanel}}
      <span class="fa fa-sort-down ml10"></span>
    </button>
    <div v-show='showChoosePanel' class="time-range-picker-panel">
      <div class="start-time">
        <span>开始时间:</span>
        <span class="time">{{startTime | uniformDate}}</span>
        <a @click='selectStartTime' class="fa fa-calendar"></a>
      </div>
      <div class="end-time">
        <span>结束时间:</span>
        <span class="time">{{endTime | uniformDate}}</span>
        <a @click='selectEndTime' class="fa fa-calendar"></a>
      </div>
      <div class="choose-submit">
        <button @click='dispatchTime'>确定</button>
      </div>
    </div>
    <date-time-picker :open.sync='showTimePicker' @timechange='timeChange' :value='defaultTime' :show-time='false'></date-time-picker>
  </div>
</template>

<script>
import DateTimePicker from './DateTimePicker'
import {uniformDate} from '../filters'

export default {
  name: 'timerangepicker',
  components: {
    'date-time-picker': DateTimePicker
  },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showChoosePanel: false,
      showTimePicker: false,
      startTime: '',
      endTime: '',
      picker: 0, // 表示starttime在取值， 1表示endtime在取值,
      defaultTime: new Date()
    }
  },
  computed: {
    timeShowPanel () {
      return uniformDate(this.startTime) + ' ~ ' + uniformDate(this.endTime) + ' '
    }
  },
  ready () {
    var curTime = new Date()
    this.startTime = new Date(curTime.getTime() - 3600 * 24 * 1000)
    this.endTime = curTime
  },
  methods: {
    selectStartTime () {
      this.picker = 0
      this.defaultTime = this.startTime
      this.showTimePicker = true
    },
    selectEndTime () {
      this.picker = 1
      this.defaultTime = this.endTime
      this.showTimePicker = true
    },
    timeChange (microtime) {
      var date = new Date(microtime)
      if (this.picker === 0) {
        this.startTime = date
      } else {
        this.endTime = date
      }
    },
    dispatchTime () {
      this.showChoosePanel = false
      this.$dispatch('timechange', this.startTime, this.endTime)
    }
  }
}
</script>

<style lang="stylus" scoped>
.time-range-picker-wrap
  height 26px
  float right
  position relative
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
  .time-range-picker-panel
    background-color white
    clear both
    z-index 99
    border 1px solid #DEDEDE
    position absolute
    margin 10px -5px
    width 200px
    .start-time, .end-time
      margin 10px 10px 8px 10px
      text-align center
      .time
        margin-left 5px
        padding 0 10px
        display inline-block
        font-size 10px
        border 1px solid #EEEEEE
        background-color #F7F7F7
      a
        margin-left 10px
      span
        cursor text
    .choose-submit
      button
        float right
        margin 0 10px 6px
        font-size 10px
        border none
        background-color #F7F7F7
        border 1px solid #EEEEEE
        outline none
</style>
