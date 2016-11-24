// import Vue from 'vue'
// import _ from 'lodash'
/**
 * 在localstorage里存入指定信息
 * @return {[type]} [description]
 */
function setInfo (name, obj) {
  let value = JSON.stringify(obj)
  window.localStorage.setItem(name, value)
}
/**
 * 获得在localstorage指定信息
 * @return {[type]} [description]
 */
function getInfo (name) {
  let obj = JSON.parse(window.localStorage.getItem(name))
  return obj
}

export default {
  setInfo,
  getInfo
}
