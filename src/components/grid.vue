<template lang="jade">
table.table.table-stripe.table-bordered
  thead
    tr
      th(v-for="column in columns", @click="sortBy(column.key)", :class="{active: sortKey === column.key}") {{ column.label }}
        span.arrow(:class="sortOrders[column.key] > 0 ? 'asc' : 'dsc'")
  tbody
    tr(v-for="entry in data | filterBy filterKey | orderBy sortKey sortOrders[sortKey]")
      td(v-for="column in columns") {{ entry[column.key] }}
.pager.tar
  button.pager-btn.pager-prev
    i.fa.fa-chevron-left
  input.pager-input(type="text")
  button.pager-btn.pager-next
    i.fa.fa-chevron-right
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  module.exports = {
    props: {
      data: Array,
      columns: Array,
      filterKey: String
    },

    data: function () {
      var sortOrders = {};
      this.columns.forEach(function (column){
        sortOrders[column.key] = 1;
      });

      return {
        sortKey: '',
        sortOrders: sortOrders
      };
    },

    methods: {
      sortBy: function (key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      }
    }
  };
</script>