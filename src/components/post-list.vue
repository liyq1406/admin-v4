<template lang="jade">
.post-list
  ul
    li(v-for="post in posts")
      a(href="{{ post.url }}") {{ post.title }}
</template>

<style lang="stylus">
@import '../assets/stylus/common'

.post-list
  padding 5px 0

  ul
    reset-list()

  li
    position relative
    margin 18px 0
    padding-left 20px

    &:before
      absolute left 2px top
      content "\2022"
</style>

<script>
module.exports = {
  props: {
    posts: {
      type: Array,
      default: function () {
        return [];
      }
    }
  }
};
</script>
