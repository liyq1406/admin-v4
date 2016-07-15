<template>
  <div class="x-breadcrumb">
    <a @click="LastLink" class="return"><i class="fa fa-arrow-circle-left"></i></a>
    <ul>
      <li v-for="item in nav">
        <template v-if="$index < nav.length - 1">
          <a v-link="item.link" class="pagelink">{{ item.label }}</a><i class="arrow">&gt;</i>
        </template>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
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
  clearfix()
  .return
    float left
    margin-right 5px
  ul
    float left
    display inline-block
    clearfix()
  li
    float left
    .pagelink
      color red
      margin-right 5px
    .arrow
      margin-right 5px
</style>
