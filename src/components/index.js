// 导航类
import Pagination from './navigation/pagination/Pagination'

const components = {
  Pagination
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  // 注册全局方法和变量

  // 注册全局指令

  // 注册全局过滤器

  // 注册全局组件
  for (let name in components) {
    Vue.component(name, components[name])
  }
}

export default {
  install
}
