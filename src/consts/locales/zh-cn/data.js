/**
 * 英文数据翻译
 */

// 图表地区
export const REGIONS = [
  { label: '全球', value: 'world' },
  { label: '国内', value: 'china' }
]

// 地图类型
export const MAP_TYPES = [
  'china',
  // 23个省
  '广东', '青海', '四川', '海南', '陕西',
  '甘肃', '云南', '湖南', '湖北', '黑龙江',
  '贵州', '山东', '江西', '河南', '河北',
  '山西', '安徽', '福建', '浙江', '江苏',
  '吉林', '辽宁', '台湾',
  // 5个自治区
  '新疆', '广西', '宁夏', '内蒙古', '西藏',
  // 4个直辖市
  '北京', '天津', '上海', '重庆',
  // 2个特别行政区
  '香港', '澳门'
]

// 账号类型
export const ACCOUNT_TYPES = [
  { value: 1, label: '消费电子' },
  { value: 2, label: '智能家居' },
  { value: 3, label: '智能安防' },
  { value: 4, label: '商用/工控设备' },
  { value: 6, label: '照明电工' },
  { value: 7, label: '生活电器' },
  { value: 8, label: '暖通空气' },
  { value: 5, label: '其他' }
]

// 告警类型
export const ALERT_TYPES = ['通知类型', '告警类型']

// 通知类型
export const INFORM_TYPES = ['通知与预警']

// 默认时间段
export const PERIODS = [
  { label: '7天', value: 7 },
  { label: '30天', value: 30 },
  { label: '90天', value: 90 }
]

// 短时间段
export const SHORT_PERIODS = [
  { label: '1天', value: 1 },
  { label: '7天', value: 7 },
  { label: '15天', value: 15 }
]

// 设备类型
export const DEVICE_TYPES = ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备', 'PC设备']

// 设备筛选待选项
export const DEVICE_VISIBILITY_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '在线', value: 'online' },
  { label: '下线', value: 'offline' },
  { label: '激活', value: 'active' },
  { label: '未激活', value: 'inactive' }
]

// 成员类型
export const MEMBER_TYPES = ['管理员', '普通会员']

// 成员状态类型
export const MEMBER_STATUS_TYPES = ['待激活', '正常', '已停用']

// 数据端点类型
export const DATAPOINT_TYPES = ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串']

// 数据端点规则
export const RULE_TYPES = ['数据端点', '设备状态']

// 比对类型
export const RULE_COMPARE_TYPES = ['等于', '大于', '小于', '大于或等于', '小于或等于', '不等于']

// 通知类型
export const RULE_INFORM_TYPES = ['通知类型', '告警类型']

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

// 产品快照存储时间间隔
export const SNAPSHOT_INTERVAL = [
  { label: '10分钟', value: 0 },
  { label: '20分钟', value: 1 },
  { label: '30分钟', value: 2 },
  { label: '1小时', value: 3 }
]