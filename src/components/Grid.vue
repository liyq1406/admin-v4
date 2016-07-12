<template>
  <table class="table table-stripe table-bordered">
    <thead>
      <tr>
        <th v-for="column in columns" @click="sortBy(column.key)" :class="{active: sortKey === column.key}">{{ column.label }}<span :class="sortOrders[column.key] > 0 ? 'asc' : 'dsc'" class="arrow"></span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in data | filterBy filterKey | orderBy sortKey sortOrders[sortKey]">
        <td v-for="column in columns">{{ entry[column.key] }}</td>
      </tr>
    </tbody>
  </table>
  <div class="pager tar">
    <button class="pager-btn pager-prev"><i class="fa fa-chevron-left"></i></button>
    <input type="text" class="pager-input"/>
    <button class="pager-btn pager-next"><i class="fa fa-chevron-right"></i></button>
  </div>
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  export default {
    props: {
      data: Array,
      columns: Array,
      filterKey: String
    },

    data () {
      var sortOrders = {}
      this.columns.forEach((column) => {
        sortOrders[column.key] = 1
      })

      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },

    methods: {
      sortBy (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      }
    }
  }
</script>
