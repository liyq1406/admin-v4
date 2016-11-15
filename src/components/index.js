// 基础类
import ButtonGroup from './base/button/ButtonGroup'

// 视图类
import Modal from './view/modal/Modal'

// 表单类
import Editor from './form/editor/Editor'
import DatePicker from './form/date-picker/DatePicker'
import DatePicker2 from './form/date-picker/DatePicker2'
import DateTimePicker from './form/date-picker/DateTimePicker'
import DateTimeMultiplePicker from './form/date-picker/DateTimeMultiplePicker'
import DateTimeRangePicker from './form/date-picker/DateTimeRangePicker'
import DateTimeSinglePicker from './form/date-picker/DateTimeSinglePicker'
import TimePicker from './form/date-picker/TimePicker'
import TimePicker2 from './form/date-picker/TimePicker2'
import FileUploader from './form/uploader/FileUploader'
import XSelect from './form/select/Select'
import Switch from './form/switch/Switch'
import Captcha from './form/captcha/Captcha'

// 导航类
import Pagination from './navigation/pagination/Pagination'
import Breadcrumb from './navigation/breadcrumb/Breadcrumb'

const components = {
  ButtonGroup,
  Modal,
  Editor,
  DatePicker,
  DatePicker2,
  DateTimePicker,
  DateTimeMultiplePicker,
  DateTimeRangePicker,
  DateTimeSinglePicker,
  TimePicker,
  TimePicker2,
  FileUploader,
  XSelect,
  Switch,
  Captcha,
  Pagination,
  Breadcrumb
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
