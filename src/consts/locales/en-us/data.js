/**
 * 英文数据翻译
 */

// 帐号类型
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
export const ALERT_TYPES = ['通知类型', '告警类型']

// 通知类型
export const INFORM_TYPES = ['通知与预警']

// 默认时间段
export const PERIODS = [
  { label: '7days', value: 7 },
  { label: '30days', value: 30 },
  { label: '90days', value: 90 }
]

// 包含全部时间段
export const AllPERIODS = [
  { label: '7days', value: 7 },
  { label: '30days', value: 30 },
  { label: 'All', value: 'all' }
]

// 一天到三十天时间段
export const PERIODS_MAP = {
  1: '24hours',
  7: '7days',
  15: '15days',
  30: '30days',
  60: '60days',
  90: '90days'
}

// 设备类型
export const DEVICE_TYPES = ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备', 'PC设备']

// 产品类型
export const PRODUCT_TYPES = [
  { label: '未定义', value: 0 },
  { label: '消费电子', value: 1 },
  { label: '智能家居', value: 2 },
  { label: '智能安防', value: 3 },
  { label: '商用/工控设备', value: 4 },
  { label: '照明电工', value: 5 },
  { label: '生活电器', value: 6 },
  { label: '暖通空气', value: 7 },
  { label: '其他', value: 8 }
]

// 产品扫描订阅策略类型
export const SCAN_MODES = [
  { label: '只允许单个用户订阅设备', value: 1 },
  { label: '允许多用户订阅设备', value: 2 }
]

// 设备筛选待选项
export const DEVICE_VISIBILITY_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '在线', value: 'online' },
  { label: '下线', value: 'offline' },
  { label: '激活', value: 'active' },
  { label: '未激活', value: 'inactive' }
]

// 固件类型
export const FIRMWARE_TYPES = [
  { label: 'WIFI', value: 1 },
  { label: 'MCU', value: 2 },
  { label: '子设备', value: 3 }
]

// 产品活跃时间段
export const ACTIVE_PERIODS = [
  { label: '1天', value: 1 },
  { label: '7天', value: 7 },
  { label: '30天', value: 30 }
]

// 平均时间段
export const AVG_PERIODS = [
  { label: '近7天', value: 7 },
  { label: '近30天', value: 30 }
]

// 产品过滤器
export const PRODUCT_FILTERS = [
  { label: '激活设备', value: 'added' },
  // { label: '在线设备', value: 'online' },
  { label: '累计激活', value: 'all' }
]

// 用户过滤器
export const USER_FILTERS = [
  { label: '新增用户', value: 'added' },
  { label: '活跃用户', value: 'active' },
  { label: '累计用户', value: 'all' }
]

// 成员类型
export const MEMBER_TYPES = ['管理员', '普通成员']

// 成员状态类型
export const MEMBER_STATUS_TYPES = ['待激活', '启用', '已停用']

// 数据端点类型
export const DATAPOINT_TYPES = [
  { value: 1, label: '布尔类型' },
  { value: 2, label: '单字节(无符号)', min: 0, max: 255 },
  { value: 3, label: '16位短整型(有符号)', min: -32768, max: 32767 },
  { value: 4, label: '32位整型(有符号)', min: -2147483648, max: 2147483647 },
  { value: 5, label: '浮点', min: -9223372036854775808, max: 9223372036854775807 },
  { value: 6, label: '字符串' },
  { value: 7, label: '字节数组' },
  { value: 8, label: '16位短整型(无符号)', min: 0, max: 65535 },
  { value: 9, label: '32位整型(无符号)', min: 0, max: 4294967295 }
]

// 数据端点规则
export const RULE_TYPES = ['数据端点', '设备状态']

// 比对类型
export const RULE_COMPARE_TYPES = ['等于', '大于', '小于', '大于或等于', '小于或等于', '不等于']

// 通知类型
export const RULE_INFORM_TYPES = [
  {
    label: '通知类型',
    value: 1
  },
  {
    label: '告警类型',
    value: 2
  }
]

// 通知方式
export const RULE_NOTIFY_TYPES = ['短信', '邮箱', '应用内推送', 'APN推送', 'Google推送']

// 可见范围类型
export const RULE_SCOPE_TYPES = ['企业可见', '用户可见', '全部可见']

// 候选标签
export const RULE_CANDIDATE_TAGS = ['严重', '轻微', '通知']

// 数据表类型
export const TABLE_TYPES = ['用户公开表', '用户私有表', '应用数据表']

// 数据表字段类型
export const TABLE_FIELD_TYPES = [
  { label: '字符串', value: 'string' },
  { label: '32位整形数字', value: 'int' },
  { label: '布尔类型', value: 'boolean' },
  { label: '浮点类型', value: 'float' },
  { label: '日期类型', value: 'date' }
]

// 数据表权限类型
export const TABLE_PERMISSION_TYPES = [
  { label: '添加', value: 'create' },
  { label: '获取', value: 'get' },
  { label: '查找', value: 'find' },
  { label: '修改', value: 'update' },
  { label: '删除', value: 'delete' }
]

// APP 类型
export const APP_TYPES = [
  { disabled: false, label: 'iOS' },
  { disabled: false, label: 'Android' },
  { disabled: false, label: 'Web' },
  { disabled: false, label: '微信' }
]

// 加密类型
export const APP_ENCRYPT_TYPES = [
  { label: '明文模式', info: '明文模式下，不使用消息体加解密功能，安全系数较低' },
  { label: '兼容模式', info: '兼容模式下，明文、密文将共存，方便开发者调试和维护' },
  { label: '安全模式（推荐）', info: '安全模式下，消息包为纯密文，需要开发者加密和解密，安全系数高' }
]

// 支持转发数据的类型
export const DATA_FORWARD_TYPES = ['设备上线', '设备下线', '设备激活', 'Pipe包', '设备同步包', '用户上线', '用户下线']

// 数据目的地
export const DATA_DESTINATIONS = ['转发到外部url', '转发到内部插件处理单元']

// 邮件模板语言
export const MAIL_TEMPLATE_LANGUAGES = [
  { label: 'zh(CN)', value: 'zh-cn' },
  { label: 'en(US)', value: 'en-us' }
]

// 产品快照存储时间间隔
export const SNAPSHOT_INTERVAL = [
  { label: '10分钟', value: 10 },
  { label: '20分钟', value: 20 },
  { label: '30分钟', value: 30 },
  { label: '1小时', value: 60 }
]

// 问题类型
export const ISSUE_TYPES = [
  { label: '新增问题', value: 0 },
  { label: '待处理问题', value: 1 }
]

// 告警级别
export const ALERT_LEVELS = {
  blue: '通知',
  orange: '轻微',
  red: '严重'
}

// 企业成员操作类型
export const OPERATE_TYPES = [
  { label: '只读', value: 1 },
  { label: '更新', value: 2 },
  { label: '删除', value: 3 },
  { label: '新增', value: 4 }
]

// 警告信息
export const ALERT_MESSAGES = {
  not_published: '您尚未发布产品，请在开发平台完成产品发布。如需了解运营平台功能您可以通过<a class="hl-red" href="http://ap.xlink.cn/#!/auto-login" target="_blank">查看demo</a>了解示例',
  not_authorized: '您尚未获得此应用的使用权限，请联系商务获取支持，<a class="hl-red" href="http://www.xlink.cn/about.html" target="_blank">查看联系方式</a>'
}
