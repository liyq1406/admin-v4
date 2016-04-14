import api from '../../api'
import * as types from '../mutation-types'

export const getAllProducts = ({ dispatch }) => {
  api.product.all().then((res) => {
    dispatch(types.RECEIVE_PRODUCTS, res.data)
  })
}
