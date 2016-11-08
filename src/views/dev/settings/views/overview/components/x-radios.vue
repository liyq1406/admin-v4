<template>
  <div>
    <div v-for="item in items" class="fl input-radio-wrap">
      <input v-model="defaultItem.value" type="radio" :value="item.value" :name="name" @change="onSelect"/>
      <label>{{ item.label }}</label>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        default () {
          return []
        }
      },
      name: {
        type: String,
        default: '',
        required: true
      },
      defaultItem: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    methods: {
      onSelect () {
        this.$emit('select', this.defaultItem.value)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .input-radio-wrap
    position relative
    line-height 30px
    display inline-block
    input, label
      vertical-align middle
    label
      margin-right 20px
</style>
