// 视图类
import Modal from './view/modal/Modal'

// 表单类
import Editor from './form/editor/Editor'
import DatePicker2 from './form/date-picker/DatePicker'
import FileUploader from './form/uploader/FileUploader'
import XSelect from './form/select/Select'

// 导航类
import Pagination from './navigation/pagination/Pagination'

const components = {
  Editor,
  DatePicker2,
  FileUploader,
  Pagination,
  Modal,
  XSelect
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
