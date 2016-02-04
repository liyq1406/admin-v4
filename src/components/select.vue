<template lang="jade">
.v-select
  slot
  .btn-group(:class="{'open':active}")
    button.btn.btn-default.active(@click="toggleDropdown", @blur="deactivate")
      span.content {{label}}
    .dropdown-menu(:style="dropdownMenuStyle")
      ul
        li(v-for="option in options", @mousedown="handleClick(option)")
          | {{option.label}}
          .fa.fa-check(v-show="option.value === value")
    i.caret(@click="toggleDropdown")
</template>

<script>
  import EventListener from './utils/EventListener';

  module.exports = {
    props: {
      options: {
        type: Array,
        default: []
      },
      value: {
        type: String,
        default: '',
        twoWay: true
      },
      height: {
        type: Number,
        default: 100
      }
    },

    data: function () {
      return {
        dropdownMenuStyle: {
          height: this.height + 'px'
        },
        active: false
      };
    },

    computed: {
      label: function () {
        var self = this;
        var option = this.options.filter(function (option) {
          return option.value === self.value;
        })[0];
        return option ? option.label : '';
      }
    },

    methods: {
      handleClick: function (option) {
        this.value = option.value;
        this.$dispatch('select', option.value);
        this.deactivate();
      },

      toggleDropdown: function () {
        this.active = !this.active;
      },

      deactivate: function () {
        this.active = false;
      }
    },

    ready: function () {
      var self = this;
      this.$dispatch('select-created', this);
      this._closeEvent = EventListener.listen(window, 'click', function (e) {
        if (!self.$el.contains(e.target)) {
          self.deactivate();
        }
      });
    },

    beforeDestroy: function () {
      if (this._closeEvent) {
        this._closeEvent.remove();
      }
    }
  };
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-select
    .btn-group
      display inline-block
      position relative
      z-index 100

      i.caret
        absolute right 10px top 10px
        triangle #FFF 10px down

      .btn
        padding 0 30px 0 20px
        max-width 140px
        box-sizing border-box
        height 25px
        line-height 25px

        span
          display block
          text-overflow 100%

      .dropdown-menu
        absolute right top 26px
        display none
        width 140px
        height 0
        border 1px solid red
        background #FFF
        overflow auto
        box-sizing border-box

        li
          position relative
          font-size 12px
          line-height 24px
          height 24px
          color red
          cursor pointer
          padding 0 10px
          overflow hidden
          white-space nowrap
          text-overflow "…"

          &:hover
            background red
            color #FFF

          .fa
            absolute right 10px top 5px

    .open > .dropdown-menu
      display block
</style>
