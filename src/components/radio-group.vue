<template lang="jade">
.btn-group(data-toggle="buttons")
  slot
</template>

<script>
module.exports = {
  props: {
    value: {
      type: String,
      twoWay: true
    },
    type: {
      type: String,
      default: 'default'
    }
  }
};
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.btn-group
  .btn
    position relative
    height 25px
    line-height 25px
    padding 0 10px
    margin-left 1px
    cursor pointer

    input[type="radio"]
      absolute left top
      appearance none
</style>