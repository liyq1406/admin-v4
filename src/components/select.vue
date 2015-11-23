<template lang="jade">
  .v-select
    slot
    .btn-group(:class="{'open':active}")
      button.btn.btn-default(:class="{'active': active || !showPlaceholder}", type="button", @click="toggleDropdown", @blur="deactivate")
        span.placeholder(v-show="showPlaceholder") {{placeholder}}
        span.content {{label}}
      .dropdown-menu(:style="dropdownMenuStyle")
        ul
          li(v-for="option in options", @mousedown="handleClick(option)")
            | {{option.label}}
            .fa.fa-check(v-show="option.value === value")
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-select
    .btn-group
      display inline-block
      position relative

      &:after
        absolute right 10px top 10px
        content ""
        triangle #FFF 10px down

      .btn
        padding 0 30px 0 20px

      .dropdown-menu
        absolute right top 26px
        display none
        width 100px
        height 0
        border 1px solid red
        background #FFF
        overflow auto

        li
          position relative
          font-size 12px
          line-height 24px
          height 24px
          color red
          cursor pointer
          padding 0 10px

          &:hover
            background red
            color #FFF

          .fa
            absolute right 10px top 5px

    .open > .dropdown-menu
      display block
</style>

<script>
  module.exports = {
    props: {
      placeholder: {
        type: String,
        default: '请选择'
      },
      options: {
        type: Array,
        default: []
      },
      value: {
        type: String,
        default: ''
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
      }
    },

    computed: {
      showPlaceholder: function () {
        return this.value.length <= 0;
      },

      label: function () {
        var self = this;
        return this.options.filter(function (option) {
          return option.value === self.value;
        })[0].label;
      }
    },

    methods: {
      handleClick: function (option) {
        if (this.value === option.value) {
          this.$dispatch('select', '');
        } else {
          this.$dispatch('select', option.value);
        }
        this.deactivate();
      },

      toggleDropdown: function () {
        this.active = !this.active;
      },

      deactivate: function () {
        this.active = false;
      }
    }
  };
</script>