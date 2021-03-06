// 全局 Mixins
// import { globalMixins } from 'src/mixins'

// 基础类
import ButtonGroup from './base/button/ButtonGroup'
import RadioButtonGroup from './base/button/RadioButtonGroup'

// 视图类
import Modal from './view/modal/Modal'
import Gallery from './view/gallery/Gallery'
import XTable from './view/table/XTable'
import PercentTable from './view/table/PercentTable'
import IntelligentTable from './view/table/IntelligentTable'
import InfoCard from './view/info/InfoCard'
import InfoList from './view/info/InfoList'
import PicTxt from './view/info/PicTxt'
import Tooltip from './view/info/Tooltip'
import Statistic from './view/info/Statistic'
import SearchBox from './view/search/SearchBox'
import PercentageBar from './view/progress/PercentageBar'
import Tree1 from './view/tree/Tree1'
import XMap from './view/map/XMap'
import Alert from './view/alert/Alert'
import AlertBar from './view/alert/AlertBar'
import Dropdown from './view/dropdown/Dropdown'
import Notification from './view/notification/Notification'
import Qrcode from './view/qrcode/Qrcode'
import Spinner from './view/loading/Spinner'

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
import ImageUploader from './form/uploader/ImageUploader'
import ImageUploaderSplashWnd from './form/uploader/ImageUploaderSplashWnd'
import XSelect from './form/select/Select'
import Switch from './form/switch/Switch'
import RadioGroup from './form/radio/RadioGroup'
import Captcha from './form/captcha/Captcha'
import AreaSelect from './form/cascader/AreaSelect'
import LocSelect from './form/cascader/LocSelect'
import Range from './form/range/Range'
import TagInput from './form/input/TagInput'

// 导航类
import Pagination from './navigation/pagination/Pagination'
import Breadcrumb from './navigation/breadcrumb/Breadcrumb'
import Tab from './navigation/tab/Tab'
import Flow from './navigation/flow/Flow'

const components = {
  ButtonGroup,
  RadioButtonGroup,
  Modal,
  Gallery,
  XTable,
  PercentTable,
  IntelligentTable,
  InfoCard,
  InfoList,
  PicTxt,
  Tooltip,
  Statistic,
  SearchBox,
  PercentageBar,
  XMap,
  Alert,
  AlertBar,
  Dropdown,
  Notification,
  Qrcode,
  Spinner,
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
  ImageUploader,
  ImageUploaderSplashWnd,
  XSelect,
  Switch,
  RadioGroup,
  Captcha,
  AreaSelect,
  LocSelect,
  Range,
  TagInput,
  Pagination,
  Breadcrumb,
  Tree1,
  Tab,
  Flow
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  // 注册全局方法和变量
  // Vue.mixin(globalMixins)

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
