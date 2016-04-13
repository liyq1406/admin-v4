module.exports = {
  state: {
    products: []
  },

  addProducts (products) {
    this.state.products = this.state.products.concat(products)
  },

  addProduct (product) {
    this.state.products.push(product)
  },

  deleteProduct (product) {
    this.state.products.$remove(product)
  }
}
