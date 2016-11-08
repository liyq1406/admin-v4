import {
  RECEIVE_PLUGINS,
  CREATE_PLUGIN,
  REMOVE_PLUGIN,
  UPDATE_PLUGIN,
  SET_CURRENT_PLUGIN
} from '../mutation-types'

// 状态初始化
var state = {
  all: [],
  curr: {}
}

// 状态变化
const mutations = {
  [RECEIVE_PLUGINS] (state, plugins) {
    state.all = plugins
  },

  [CREATE_PLUGIN] (state, plugin) {
    state.all.push(plugin)
  },

  [REMOVE_PLUGIN] (state, plugin) {
    var plugins = state.all.concat()
    _.remove(plugins, (item) => {
      return item.id === plugin.id
    })
    state.all = plugins
  },

  [UPDATE_PLUGIN] (state, plugin) {
    var plugins = state.all.concat()
    state.all = plugins.map((item) => {
      if (item.id === plugin.id) {
        return plugin
      }
      return item
    })
  },

  [SET_CURRENT_PLUGIN]  (state, plugin) {
    state.curr = plugin
  }
}

export default {
  state,
  mutations
}
