module.exports = {
  state: {
    all: []
  },

  addProducts (products) {
    this.state.all = this.state.all.concat(products)
  },

  addProduct (product) {
    this.state.all.push(product)
  },

  deleteProduct (product) {
    this.state.all.$remove(product)
  }
}
