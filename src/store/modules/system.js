import {
  RECEIVE_CORP,
  RECEIVE_MEMBER,
  SWITCH_LAYOUTS,
  SET_LOADING_STATUS,
  RECEIVE_ERROR,
  REMOVE_ERROR,
  ADD_NOTICE,
  HIDE_ERROR,
  REMOVE_NOTICES,
  ADD_ALERT_BAR,
  REMOVE_ALERT_BAR,
  ADD_ALERT_MASK,
  REMOVE_ALERT_MASK,
  SET_ECHARTS_STATUS
} from '../mutation-types'

// 状态初始化
var state = {
  corp: {},  // 当前企业信息
  currentMember: {},  // 当前成员信息
  layouts: [],        // 当前页面布局
  loading: false,     // 是否正在加载
  error: {},          // 错误信息
  isShowError: false, // 是否显示错误信息模态窗口
  after: null,        // 后续执行函数
  notices: [],        // 通知信息
  plugins: [],        // 插件列表
  alertMsg: '',       // 警告栏信息
  isShowMask: false,   // 是否显示警示遮罩
  echartsStatus: 0 // echarts script 加载状态 0未加载 1加载中 2已加载
}

// 状态变化
const mutations = {
  // 接收到企业信息
  [RECEIVE_CORP] (state, corp) {
    state.corp = corp
  },

  // 接收到帐户成员信息
  [RECEIVE_MEMBER] (state, member) {
    state.currentMember = member
  },

  // 切换布局
  [SWITCH_LAYOUTS] (state, layouts) {
    state.layouts = layouts
  },

  [SET_LOADING_STATUS] (state, status) {
    state.loading = status
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
  },

  // 加入警告信息
  [ADD_ALERT_BAR] (state, msg) {
    state.alertMsg = msg
  },

  // 移除通知信息
  [REMOVE_ALERT_BAR] (state) {
    state.alertMsg = ''
  },

  // 加入警告信息
  [ADD_ALERT_MASK] (state) {
    state.isShowMask = true
  },

  // 移除通知信息
  [REMOVE_ALERT_MASK] (state) {
    state.isShowMask = false
  },

  // 设置echarts script 标签当前状态 当前状态
  [SET_ECHARTS_STATUS] (state, status) {
    state.echartsStatus = status
  }
}

export default {
  state,
  mutations
}
