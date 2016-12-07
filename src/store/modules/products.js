import {
  RECEIVE_PRODUCTS,
  CREATE_PRODUCT,
  REMOVE_PRODUCT,
  UPDATE_PRODUCT,
  SET_CURRENT_PRODUCT,
  SET_CURRENT_DEVICE,
  SET_CURRENT_VIRTUAL_DEVICE
} from '../mutation-types'
// import Vue from 'vue'

// 状态初始化
var state = {
  all: [],
  released: [],
  curr: {},
  currDevice: {},
  currVirtualDevice: {}
}

function filterReleased (products) {
  let userRole = window.localStorage.getItem('userRole')
  let config = ({
    'member': null,
    'dealer': JSON.parse(window.localStorage.getItem('dealerConfig')),
    'heavy-buyer': JSON.parse(window.localStorage.getItem('heavyBuyerConfig'))
  })[userRole]

  // 独立入口过滤产品
  if (config) {
    return products.filter((item) => {
      let result = false
      config.product.forEach((product) => {
        if (product.is_visible && product.product_id === item.id) {
          result = true
        }
      })
      console.log(item.is_release && result)
      return (item.is_release && result)
    })
  }
  return products.filter((item) => {
    return item.is_release
  })
}

// 状态变化
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
    state.released = filterReleased(state.all)
  },

  [CREATE_PRODUCT] (state, product) {
    state.all.push(product)
    state.released = filterReleased(state.all)
  },

  [REMOVE_PRODUCT] (state, product) {
    var products = state.all.concat()
    _.remove(products, (item) => {
      return item.id === product.id
    })
    state.all = products
    state.released = filterReleased(state.all)
  },

  [UPDATE_PRODUCT] (state, product) {
    var products = state.all.concat()
    state.all = products.map((item) => {
      if (item.id === product.id) {
        return product
      }
      return item
    })
    state.released = filterReleased(state.all)
  },

  [SET_CURRENT_PRODUCT] (state, product) {
    state.curr = product
  },

  [SET_CURRENT_DEVICE] (state, device) {
    state.currDevice = device
  },

  [SET_CURRENT_VIRTUAL_DEVICE] (state, device) {
    state.currVirtualDevice = device
  }
}

export default {
  state,
  mutations
}
