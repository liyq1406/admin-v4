<template lang="jade">
.nav-aside-item(v-for="product in productsState.products")
  a(v-link="{ name: 'products', params: { id: product.id} }")
    i.fa.fa-link
    | {{ product.name }}
</template>

<script>
module.exports = {
  data: function () {
    return {

    };
  }
}
</script>
