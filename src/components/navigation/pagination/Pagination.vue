<template>
  <div class="x-pagination">Pagination</div>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    // 当前页
    current: {
      type: Number,
      default: 1
    },

    // 总数
    total: {
      type: Number,
      default: 0
    },

    // 每页显示数
    pageSize: {
      type: Number,
      default: 10
    },

    // 可选每页显示数
    pageSizeOptions: {
      type: Array,
      default () {
        return [10, 20, 50, 100]
      }
    },

    // 是否简单分页
    simple: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">
.x-pagination {
  clearfix()
}
</style>
