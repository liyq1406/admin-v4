import {
  RECEIVE_PRODUCTS
} from '../mutation-types'

// 状态初始化
var state = {
  all: []
}

// 状态变化
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  }
}

export default {
  state,
  mutations
}
