<template>
  <div class="time-picker-box">
    <!-- <pre>{{ currDate }}</pre> -->
    <div class="form">
      <form>
        <span class="input-text-wrap hour-box">
          <input type="text" class="input-text" v-model="hour" :style="'width:'+width">
        </span>
        <span>:</span>
        <span class="input-text-wrap minute-box">
          <input type="text" class="input-text" v-model="minute" :style="'width:'+width">
        </span>
        <span>:</span>
        <span class="input-text-wrap second-box">
          <input type="text" class="input-text" v-model="second" :style="'width:'+width">
        </span>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TimePicker2',

    props: {
      // 值
      value: {
        type: String,
        twoWay: false
      },
      width: {
        type: String,
        default: '40px'
      }
    },

    data () {
      return {
        hour: '00',
        minute: '00',
        second: '00'
      }
    },

    watch: {
      hour () {
        var result = '00'
        var hour = String(this.hour) || '00'
        console.log(hour)
        this.hour = hour.replace(/\D/, '')
        if (this.hour - 0 < 0) {
          result = '00'
        } else if (this.hour - 0 > 23) {
          result = '23'
        } else {
          result = parseInt(this.hour) > 9 ? parseInt(this.hour) : '0' + parseInt(this.hour)
        }
        this.hour = String(result)
        this.value = this.hour + ':' + this.minute + ':' + this.second
        this.$emit('select-time', this.value)
      },

      minute () {
        var result = '00'
        var minute = String(this.minute) || '00'
        console.log(minute)
        this.minute = minute.replace(/\D/, '')
        if (this.minute - 0 < 0) {
          result = '00'
        } else if (this.minute - 0 > 59) {
          result = '59'
        } else {
          result = parseInt(this.minute) > 9 ? parseInt(this.minute) : '0' + parseInt(this.minute)
        }
        this.minute = String(result)
        this.value = this.hour + ':' + this.minute + ':' + this.second
        this.$emit('select-time', this.value)
      },

      second () {
        var result = '00'
        var second = String(this.second) || '00'
        console.log(second)
        this.second = second.replace(/\D/, '')
        if (this.second - 0 < 0) {
          result = '00'
        } else if (this.second - 0 > 59) {
          result = '59'
        } else {
          result = parseInt(this.second) > 9 ? parseInt(this.second) : '0' + parseInt(this.second)
        }
        this.second = String(result)
        this.value = this.hour + ':' + this.minute + ':' + this.second
        this.$emit('select-time', this.value)
      },
      value () {
        this.initTime()
      }
    },
    ready () {
      this.initTime()
    },
    methods: {
      initTime () {
        if (this.value) {
          this.hour = this.value.split(':')[0] || '00'
          this.minute = this.value.split(':')[1] || '00'
          this.second = this.value.split(':')[2] || '00'
        } else {
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          this.value = '00:00:00'
          this.$emit('select-time', this.value)
        }
      }
    }
  }
</script>

<style lang="stylus">
  .time-picker-box
    width 100%
    .input-text-wrap
      display inline-block
      .input-text
        text-align center
</style>
