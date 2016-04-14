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
