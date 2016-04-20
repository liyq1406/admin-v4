import {
  RECEIVE_MEMBER,
  SWITCH_LAYOUT,
  RECEIVE_ERROR,
  REMOVE_ERROR,
  ADD_NOTICE,
  HIDE_ERROR,
  REMOVE_NOTICES
} from '../mutation-types'

// 状态初始化
var state = {
  currentMember: {},  // 当前成员信息
  layout: 'auth',     // 当前页面布局 ['auth'|'admin']
  error: {},          // 错误信息
  isShowError: false, // 是否显示错误信息模态窗口
  after: null,        // 后续执行函数
  notices: [],        // 通知信息
  plugins: []         // 插件列表
}

// 状态变化
const mutations = {
  // 接收到帐户成员信息
  [RECEIVE_MEMBER] (state, member) {
    state.currentMember = member
  },

  // 切换布局
  [SWITCH_LAYOUT] (state, layout) {
    state.layout = layout
  },

  // 接收到错误信息
  [RECEIVE_ERROR] (state, error, callback) {
    state.error = error
    state.isShowError = true
    if (typeof callback === 'function') {
      state.after = callback
    } else {
      state.after = null
    }
  },

  // 移除错误信息
  [REMOVE_ERROR] (state) {
    state.error = {}
    state.after && state.after()
  },

  [HIDE_ERROR] (state) {
    state.isShowError = false
  },

  // 加入通知信息
  [ADD_NOTICE] (state, notice) {
    if (!state.notices.length || state.notices[state.notices.length - 1].content !== notice.content) {
      state.notices.push(notice)
    }
  },

  // 移除通知信息
  [REMOVE_NOTICES] (state) {
    state.notices.shift()
  }
}

export default {
  state,
  mutations
}
