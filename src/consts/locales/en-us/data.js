/**
 * 英文数据翻译
 */

// 账户类型
export const ACCOUNT_TYPES = [
  { value: 1, label: 'Consumer electronics' },
  { value: 2, label: 'Smart Home' },
  { value: 3, label: 'Smart Security' },
  { value: 4, label: 'Commercial / industrial equipment' },
  { value: 6, label: 'Lighting Electrical' },
  { value: 7, label: 'Living electric apparatus' },
  { value: 8, label: 'HVAC air' },
  { value: 5, label: 'Others' }
]

// 告警类型
export const ALERT_TYPES = ['Message Type', 'Alert Type']

// 通知类型
export const INFORM_TYPES = ['Notification And Alert']

// 默认时间段
export const PERIODS = [
  { label: '7 Day', value: 7 },
  { label: '30 Day', value: 30 },
  { label: '90 Day', value: 90 }
]

// 包含全部时间段
export const AllPERIODS = [
  { label: '7 Day', value: 7 },
  { label: '30 Day', value: 30 },
  { label: 'All', value: 'all' }
]

// 一天到三十天时间段
export const PERIODS_MAP = {
  1: '1 Day',
  7: '7 Day',
  15: '15 Day',
  30: '30 Day',
  60: '60 Day',
  90: '90 Day'
}

// Device Type
export const DEVICE_TYPES = ['WiFi Device', 'Zigbee Gateway', 'Bluetooth Device', 'Bluetooth Mesh Device', 'PC Device']

// Product Type
export const PRODUCT_TYPES = [
  { label: 'Undefined', value: 0 },
  { label: 'Consumer Electronics', value: 1 },
  { label: 'Smart Furnishing', value: 2 },
  { label: 'Smart Security', value: 3 },
  { label: 'Commercial/Industrial Equipment', value: 4 },
  { label: 'Eletric Lightning', value: 5 },
  { label: 'Electric Appliance', value: 6 },
  { label: 'Central Heating', value: 7 },
  { label: 'Others', value: 8 }
]

// Order Type
export const SCAN_MODES = [
  { label: 'Single user order only.', value: 1 },
  { label: 'Accept multi-user order.', value: 2 }
]

// Device Filter
export const DEVICE_VISIBILITY_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Activated', value: 'active' },
  { label: 'Inactivated', value: 'inactive' }
]

// 时间区段筛选待选项
export const TIME_RANGE_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Specified', value: 'specified' }
]

// Firmware Type
export const FIRMWARE_TYPES = [
  { label: 'WIFI', value: 1 },
  { label: 'MCU', value: 2 },
  { label: 'Sub-device', value: 3 }
]

// 产品活跃时间段
export const ACTIVE_PERIODS = [
  { label: '1 day', value: 1 },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 }
]

// 平均时间段
export const AVG_PERIODS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 }
]

// 产品过滤器
export const PRODUCT_FILTERS = [
  { label: 'New Activated', value: 'added' },
  // { label: '在线设备', value: 'online' },
  { label: 'Total Activated', value: 'all' }
]

// 用户过滤器
export const USER_FILTERS = [
  { label: 'New User', value: 'added' },
  { label: 'Active User', value: 'active' },
  { label: 'Total User', value: 'all' }
]

// 成员类型
export const MEMBER_TYPES = {
  '1': 'Administrator',
  '2': 'Operator',
  '3': 'Developer'
}

// 成员状态类型
export const MEMBER_STATUS_TYPES = ['To be Activated', 'Enable', 'Disabled']

// 数据端点类型
export const DATAPOINT_TYPES = [
  { value: 1, label: 'Boolean' },
  { value: 2, label: 'Single Byte(Unsigned)', min: 0, max: 255 },
  { value: 3, label: 'Short Integer(Signed)', min: -32768, max: 32767 },
  { value: 4, label: 'Integer(Signed)', min: -2147483648, max: 2147483647 },
  { value: 5, label: 'Float', min: -9223372036854775808, max: 9223372036854775807 },
  { value: 6, label: 'String' },
  { value: 7, label: 'Char Array' },
  { value: 8, label: 'Short Integer(UnSigned)', min: 0, max: 65535 },
  { value: 9, label: 'Integer(Unsigned)', min: 0, max: 4294967295 }
]

// 数据端点规则
export const RULE_TYPES = ['Data Endpoint', 'Device Status', 'Data Endpoint']

// 比对类型
export const RULE_COMPARE_TYPES = ['Equal', 'Large than', 'Less than', 'Large than or equal', 'Less than or equal', 'Not equal']

// 通知类型
export const RULE_INFORM_TYPES = [
  {
    label: 'Notification Type',
    value: 1
  },
  {
    label: 'Alert Type',
    value: 2
  }
]

// 通知方式
export const RULE_NOTIFY_TYPES = ['SMS', 'Email', 'App Push', 'APN Push', 'Google Push']

// 可见范围类型
export const RULE_SCOPE_TYPES = ['Enterprise Only', 'User Only', 'All']

// 候选标签
export const RULE_CANDIDATE_TAGS = ['Critical', 'Warning', 'Notification']

// 数据表类型
export const TABLE_TYPES = ['User Public Table', 'User Private Table', 'Application Data Table']

// 数据表字段类型
export const TABLE_FIELD_TYPES = [
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'int' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Float', value: 'float' },
  { label: 'Date', value: 'date' }
]

// 数据表权限类型
export const TABLE_PERMISSION_TYPES = [
  { label: 'Create', value: 'create' },
  { label: 'Get', value: 'get' },
  { label: 'Find', value: 'find' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' }
]

// APP 类型
export const APP_TYPES = [
  { disabled: false, label: 'iOS' },
  { disabled: false, label: 'Android' },
  { disabled: false, label: 'Web' },
  { disabled: false, label: 'Wechat' }
]

// 加密类型
export const APP_ENCRYPT_TYPES = [
  { label: 'Plaintext Mode', info: 'Under plaintext mode, no encryption/decryption function is used in message body, the security coefficient is comparatively low.' },
  { label: 'Compatible Mode', info: 'Under compatible mode, plain text and ciphertext coexist, which is convenient for developers to debug and maintain.' },
  { label: 'Safe Mode (Recommended)', info: 'Under safe mode, messages are all ciphertext, encryption and decryption are needed, but with high security coefficient.' }
]

// 支持转发数据的类型
export const DATA_FORWARD_TYPES = ['Device Online', 'Device Offline', 'Activated', 'Pipe Package', 'Device Sync Package', 'User Online', 'User Offline']

// 数据目的地
export const DATA_DESTINATIONS = ['Forward to outgoing url', 'Forward to the internal plugin processing unit']

// 邮件模板语言
export const MAIL_TEMPLATE_LANGUAGES = [
  { label: 'zh(CN)', value: 'zh-cn' },
  { label: 'en(US)', value: 'en-us' }
]

// 产品快照存储时间间隔
export const SNAPSHOT_INTERVAL = [
  { label: '10min', value: 10 },
  { label: '20min', value: 20 },
  { label: '30min', value: 30 },
  { label: '1hr', value: 60 }
]

// 问题类型
export const ISSUE_TYPES = [
  { label: 'New Issue', value: 0 },
  { label: 'Pending Issue', value: 1 }
]

// 告警级别
export const ALERT_LEVELS = {
  blue: 'Notification',
  orange: 'Warning',
  red: 'Critical'
}

// 企业成员操作类型
export const OPERATE_TYPES = [
  { label: 'Read only', value: 1 },
  { label: 'Update', value: 2 },
  { label: 'Delete', value: 3 },
  { label: 'Create', value: 4 }
]

export const WEEK_RANGE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// 警告信息
export const ALERT_MESSAGES = {
  not_published: 'You have not released product. Please release your product in the development platform. If you need to learn about the functions of the operation platform, you could run <a class="hl-red" href="http://ap.xlink.cn/#!/auto-login" target="_blank">view demo</a> to view the examples',
  not_authorized: 'You have not got the access permission of this application. Please contact business for support. <a class="hl-red" href="http://www.xlink.cn/about.html" target="_blank">view contact information</a>'
}
