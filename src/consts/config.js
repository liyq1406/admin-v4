
module.exports = {
  apiRoot: 'http://42.121.122.228:8887/v2',
  // apiRoot: 'http://ic.heiman.cn:8887/v2',
  // apiRoot: 'http://120.26.209.230:8887/v2',
  // apiRoot: 'http://wx-js.xlink.cn:8887/v2',
  // 正式地址
  // apiRoot: 'http://api2.xlink.cn:80/v2',

  // 刷新验证码等待间隔
  verifycodeDuration: 90,

  // 表格每页记录数
  pageCount: 10,

  // 图表周期
  periods: [
    { label: '7天', value: 7 },
    { label: '30天', value: 30 },
    { label: '90天', value: 90 }
  ],

  // 图表地区
  regions: [
    { label: '全球', value: 'world'},
    { label: '国内', value: 'china' }
  ],

  // 图表类型
  mapType: [
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
  ],

  deviceTypes: ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备'],

  // 数据端点类型
  datapointTypes: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],

  // 告警规则类型
  ruleTypes: ['数据端点', '设备状态'],

  // 通知方式
  notifyTypes: ['短信', '邮箱', '应用内推送', 'APN推送'],

  // 可见范围
  scopeTypes: ['企业可见', '用户可见', '全部可见'],

  // 启用状态(通用)
  enableStates: ['启用', '禁用'],

  // 待选标签
  candidateTags: ['严重', '轻微', '通知'],

  // 账号类型
  accountTypes: ['消费电子（含穿戴设备/娱乐产品等）', '智能家居', '智能安防', '商用/工控设备', '其它'],

  // 数据表字段类型
  fieldTypes: [
    { label: '字符串', value: 'string' },
    { label: '32位整形数字', value: 'int' },
    { label: '布尔类型', value: 'boolean' },
    { label: '浮点类型', value: 'float' },
    { label: '日期类型', value: 'date' }
  ],

  // 数据表权限类型
  permissionTypes: [
    { label: '添加', value: 'create' },
    { label: '获取', value: 'get' },
    { label: '查找', value: 'find' },
    { label: '修改', value: 'update' },
    { label: '删除', value: 'delete' }
  ],

  // APP 类型
  appTypes: [
    { label: 'iOS', disabled: false },
    { label: 'Android', disabled: true },
    { label: 'Web', disabled: true },
    { label: '微信', disabled: true }
  ],

  // 邮件模板语言类型
  templateLanguages: [
    { label: '中文(简体)', value: 'zh-cn' },
    { label: '英语(美国)', value: 'en-us' }
  ]
};
