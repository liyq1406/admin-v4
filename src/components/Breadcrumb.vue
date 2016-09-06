<template>
  <div class="x-breadcrumb">
    <a @click="LastLink" class="return"><i class="fa fa-arrow-circle-left"></i></a>
    <template v-for="item in nav">
      <a v-if="$index < nav.length - 1" v-link="item.link" class="pagelink">{{ item.label }}</a>
      <span v-else>{{ item.label }}</span>
      <i class="arrow" v-if="$index < nav.length - 1">&gt;</i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',

  props: {
    nav: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
    LastLink () {
      var last = this.nav[this.nav.length - 2].link
      this.$route.router.go(last)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'
.x-breadcrumb
  border-bottom 1px solid default-border-color
  padding 5px 15px 10px
  line-height 20px
  font-size 12px
  clearfix()

  a
  span
  i
    display inline-block

  .return
    color gray-light
    margin-right 5px
    font-size 16px

    &:hover
      color gray

  .pagelink
    color red
    margin-right 5px

  .arrow
    color gray-light
    margin-right 5px

  &.no-split-line
    border-bottom none
</style>
