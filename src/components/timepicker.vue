<template lang="jade">
  .timepicker
    .input-text-wrap
      input.input-text(type="text", v-model="value", @click="inputClick")
    .timepicker-popup(v-show="displayTimeView", :class="{'timepicker-popup-right':pullLeft}")
      .timepicker-inner
        .timepicker-body
          .select.select-sm
            select(v-model="hour", @change="updateValue")
              option(v-for="option in 24", v-bind:value="zeroPrefix(option)", v-bind:selected="hour === zeroPrefix(option)") {{zeroPrefix(option)}}
          .divide :
          .select.select-sm
            select(v-model="minute", @change="updateValue")
              option(v-for="option in 60", v-bind:value="zeroPrefix(option)", v-bind:selected="minute === zeroPrefix(option)") {{zeroPrefix(option)}}
          .divide :
          .select.select-sm
            select(v-model="second", @change="updateValue")
              option(v-for="option in 60", v-bind:value="zeroPrefix(option)", v-bind:selected="second === zeroPrefix(option)") {{zeroPrefix(option)}}
</template>

<script>
  var EventListener = require('./utils/EventListener');

  module.exports = {
    props: {
      value: {
        type: String,
        twoWay: true
      },
      pullLeft: {
        type: Boolean,
        default: false
      }
    },

    data: function () {
      return {
        displayTimeView: false,
        hour: '',
        minute: '',
        second: ''
      };
    },

    methods: {
      close: function () {
        this.displayTimeView = false;
      },

      inputClick: function () {
        this.displayTimeView = !this.displayTimeView;
      },

      zeroPrefix: function (value) {
        return value >= 10 ? value.toString() : '0' + value;
      },

      updateValue: function () {
        this.value = this.hour + ':' + this.minute + ':' + this.second;
        this.$dispatch('select-time');
      }
    },

    watch: {
      displayTimeView: function () {
        if (this.value.length > 0) {
          var timeArr = this.value.split(':');
          this.hour = timeArr[0];
          this.minute = timeArr[1];
          this.second = timeArr[2];
        }
      }
    },

    ready: function () {
      var self = this;
      this.$dispatch('timepicker-created', this);
      this._closeEvent = EventListener.listen(window, 'click', function (e) {
        if (!self.$el.contains(e.target)) {
          self.close();
        }
      });
    },

    beforeDestroy() {
      if (this._closeEvent){
        this._closeEvent.remove();
      }
    }
  };
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .timepicker
    position relative

  .timepicker-popup
    position absolute
    border 1px solid #DDD
    margin-top 2px
    background #FFF
    z-index 1000
    box-shadow 0 6px 12px rgba(0, 0, 0, .2)

  .timepicker-popup-right
    right 0

  .timepicker-inner
    width 244px

  .timepicker-body
    padding 10px

    .select
    .divide
      display inline-block

    .select
      width 64px

    .divide
      margin 0 6px

</style>
