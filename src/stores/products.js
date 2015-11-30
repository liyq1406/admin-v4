module.exports = {
  state: {
    products: []
  },

  addProducts: function (products) {
    this.state.products = this.state.products.concat(products);
  },

  addProduct: function (product) {
    this.state.products.push(product);
  },

  deleteProduct: function (product) {
    this.state.products.$remove(product);
  }
};
