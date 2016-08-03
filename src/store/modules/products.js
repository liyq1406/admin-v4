import {
  RECEIVE_PRODUCTS,
  CREATE_PRODUCT,
  REMOVE_PRODUCT,
  UPDATE_PRODUCT,
  SET_CURRENT_PRODUCT,
  SET_CURRENT_VIRTUAL_DEVICE
} from '../mutation-types'
import _ from 'lodash'
// import Vue from 'vue'

// 状态初始化
var state = {
  all: [],
  curr: {},
  currVirtualDevice: {}
}

// 状态变化
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  },

  [CREATE_PRODUCT] (state, product) {
    state.all.push(product)
  },

  [REMOVE_PRODUCT] (state, product) {
    var products = state.all.concat()
    _.remove(products, (item) => {
      return item.id === product.id
    })
    state.all = products
  },

  [UPDATE_PRODUCT] (state, product) {
    var products = state.all.concat()
    state.all = products.map((item) => {
      if (item.id === product.id) {
        return product
      }
      return item
    })
  },

  [SET_CURRENT_PRODUCT] (state, product) {
    state.curr = product
  },

  [SET_CURRENT_VIRTUAL_DEVICE] (state, device) {
    state.currVirtualDevice = device
  }
}

export default {
  state,
  mutations
}
