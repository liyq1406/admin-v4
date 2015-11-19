<template lang="jade">
  .btn-group.v-select
    button.btn.btn-default(:class="{'active': active}", @click="active=!active")
      span.placeholder(v-show="!value") {{placeholder}}
      span.content {{value}}
    .dropdown-menu(:style="dropdownMenuStyle", v-show="active")
      ul
        li(v-for="option in options", @click="handleClick(option)")
          | {{option}}
          .fa.fa-check(v-show="option === value")
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-select
    position relative

    &:after
      absolute right 10px top 10px
      content ""
      triangle #FFF 10px down

    .btn
      padding 0 30px 0 20px

    .dropdown-menu
      absolute right top 26px
      width 100px
      height 0
      background red

      li
        font-size 12px
        line-height 24px
        height 24px
        color #FFF
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

    methods: {
      handleClick: function (data) {
        if (this.value === data) {
          this.$dispatch('select', '');
        } else {
          this.$dispatch('select', data);
        }
      }
    }
  };
</script>