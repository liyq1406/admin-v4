import * as types from '../mutation-types'

export const getAllPlugin = ({ dispatch }, plugins) => {
  dispatch(types.RECEIVE_PLUGINS, plugins)
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

export const setCurrPlugin = ({ dispatch }, plugin) => {
  dispatch(types.SET_CURRENT_PLUGIN, plugin)
}
