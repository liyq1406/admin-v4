import api from '../../api'
import * as types from '../mutation-types'

export const getAllPlugins = ({ dispatch }, vm) => {
  api.app.list().then((res) => {
    if (res.status === 200) {
      res.data.forEach((item) => {
        if (item.type > 4) {
          dispatch(types.CREATE_PLUGIN, item)
        }
      })
    }
  }).catch((res) => {
    if (typeof res.data !== 'undefined' && typeof res.data.error !== 'undefined') {
      if (res.data.error.code === 4031003) {
        vm.$route.router.go('/login')
      }
    }
  })
}

export const createPlugin = ({ dispatch }, plugin) => {
  dispatch(types.CREATE_PLUGIN, plugin)
}

export const removePlugin = ({ dispatch }, plugin) => {
  dispatch(types.REMOVE_PLUGIN, plugin)
}

export const updatePlugin = ({ dispatch }, plugin) => {
  dispatch(types.UPDATE_PLUGIN, plugin)
}
