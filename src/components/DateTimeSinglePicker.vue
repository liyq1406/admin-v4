<template>
  <div class="time-range-picker-wrap">
    <button @click='showTimePicker=!showTimePicker' class="time-range-show" readonly="readonly">{{timeShowPanel}}
      <span class="fa fa-sort-down ml10"></span>
    </button>
    <date-time-picker :open.sync='showTimePicker' @timechange='timeChange' :value='defaultTime' :show-time='true'></date-time-picker>
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
      showTimePicker: false,
      startTime: new Date(),
      defaultTime: new Date()
    }
  },
  computed: {
    timeShowPanel () {
      return uniformDate(this.startTime)
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
