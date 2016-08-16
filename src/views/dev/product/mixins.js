import store from 'store/index'
import { getCurrProduct } from 'store/actions/products'

export var setCurrProductMixin = {
  store,

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    },
    actions: {
      getCurrProduct
    }
  },

  route: {
    data () {
      // 设置当前产品
      this.getCurrProduct(this.$route.params.id)
    }
  }
}
