import Vue from 'vue'
import locales from 'consts/locales/index'
import * as config from 'consts/config'
import * as types from '../mutation-types'

// 设置当前布局
export const setLayout = ({ dispatch }, layout) => {
  dispatch(types.SWITCH_LAYOUT, layout)
}

// 获取当前帐户成员
export const setCurrentMember = ({ dispatch }, member) => {
  dispatch(types.RECEIVE_MEMBER, member)
}

// 开始加载资源
export const setLoadingStatus = ({ dispatch }, status) => {
  dispatch(types.SET_LOADING_STATUS, status)
}

// 弹出错误提示
export const showError = ({ dispatch }, error, fn) => {
  let err = {}
  err.code = error.code
  err.msg = locales[Vue.config.lang].errors[error.code]
  dispatch(types.RECEIVE_ERROR, err, fn)
}

// 关闭错误提示
export const removeError = ({ dispatch }) => {
  dispatch(types.REMOVE_ERROR)
}

// 移除错误提示
export const hideError = ({ dispatch }) => {
  dispatch(types.HIDE_ERROR)
}

// 显示通知
export const showNotice = ({ dispatch }, notice) => {
  dispatch(types.ADD_NOTICE, notice)
  window.setTimeout(() => {
    dispatch(types.REMOVE_NOTICES)
  }, config.NOTICE_DURATION)
}
