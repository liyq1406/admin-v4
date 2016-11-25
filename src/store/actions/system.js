import Vue from 'vue'
import locales from 'consts/locales/index'
import * as config from 'consts/config'
import * as types from '../mutation-types'

// 设置当前布局
export const setLayouts = ({ dispatch }, layouts) => {
  dispatch(types.SWITCH_LAYOUTS, layouts)
}

// 获取当前帐户成员
export const setCorp = ({ dispatch }, corp) => {
  dispatch(types.RECEIVE_CORP, corp)
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
  if (typeof error === 'string') {
    err.msg = error
  } else {
    err.code = error.code
    err.msg = locales[Vue.config.lang].errors[error.code]
  }
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

// 显示警告栏
export const showAlertBar = ({ dispatch }, msg) => {
  dispatch(types.ADD_ALERT_BAR, msg)
}

// 移除警告栏
export const removeAlertBar = ({ dispatch }) => {
  dispatch(types.REMOVE_ALERT_BAR)
}

// 显示警示遮罩
export const showAlertMask = ({ dispatch }) => {
  dispatch(types.ADD_ALERT_MASK)
}

// 移除警示遮罩
export const removeAlertMask = ({ dispatch }) => {
  dispatch(types.REMOVE_ALERT_MASK)
}

// 动态加载echart script标签
export const importEcharts = ({ dispatch }) => {
  dispatch(types.SET_ECHARTS_STATUS, 1) // 加载中
  let script = document.createElement('script')
  script.src = '/static/vendor/echart/echarts.min.js'
  document.body.appendChild(script)
  script.addEventListener('load', () => {
    dispatch(types.SET_ECHARTS_STATUS, 2) // 加载完成
  })
}
