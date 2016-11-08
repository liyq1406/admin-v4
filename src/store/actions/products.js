import * as types from '../mutation-types'
import api from 'api'

export const getAllProducts = ({ dispatch }, products) => {
  dispatch(types.RECEIVE_PRODUCTS, products)
}

export const createProduct = ({ dispatch }, product) => {
  dispatch(types.CREATE_PRODUCT, product)
}

export const removeProduct = ({ dispatch }, product) => {
  dispatch(types.REMOVE_PRODUCT, product)
}

export const updateProduct = ({ dispatch }, product) => {
  dispatch(types.UPDATE_PRODUCT, product)
  dispatch(types.SET_CURRENT_PRODUCT, product)
}

export const setCurrProduct = ({ dispatch }, product) => {
  dispatch(types.SET_CURRENT_PRODUCT, product)
}

export const getCurrProduct = ({ dispatch, state }, id) => {
  // 如果 state 中不存在当前产品或当前产品 id与路由中的产品 id 不一致，重新获取产品
  let product = _.find(state.products.all, (item) => {
    return item.id === id
  })
  if (product) {
    dispatch(types.SET_CURRENT_PRODUCT, product)
  } else {
    // 获取当前产品
    api.product.getProduct(id).then((res) => {
      if (res.status === 200) {
        dispatch(types.SET_CURRENT_PRODUCT, res.data)
      }
    })
  }
}

export const setCurrDevice = ({ dispatch }, device) => {
  dispatch(types.SET_CURRENT_DEVICE, device)
}

export const setCurrVirtualDevice = ({ dispatch }, device) => {
  dispatch(types.SET_CURRENT_VIRTUAL_DEVICE, device)
}
