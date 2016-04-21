import api from '../../api'
import * as types from '../mutation-types'

export const getAllProducts = ({ dispatch }, vm) => {
  api.product.all().then((res) => {
    dispatch(types.RECEIVE_PRODUCTS, res.data)
  }).catch((res) => {
    if (typeof res.data !== 'undefined' && typeof res.data.error !== 'undefined') {
      if (res.data.error.code === 4031003) {
        vm.$route.router.go('/login')
      }
    }
  })
}

export const createProduct = ({ dispatch }, product) => {
  dispatch(types.CREATE_PRODUCT, product)
}

export const removeProduct = ({ dispatch }, product) => {
  dispatch(types.REMOVE_PRODUCT, product)
}

export const updateProduct = ({ dispatch }, product) => {
  dispatch(types.UPDATE_PRODUCT, product)
}

export const setCurrProduct = ({ dispatch }, product) => {
  dispatch(types.SET_CURRENT_PRODUCT, product)
}

export const setParamsCurrentProduct = ({ dispatch }, product) => {
  dispatch(types.SET_PARAMS_CURRENT_PRODUCT, product)
}
