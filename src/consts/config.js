
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

  // deviceTypes: ['WiFi设备', 'Zigbee网关', '蓝牙设备', '蓝牙Mesh设备'],

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
  // accountTypes: ['消费电子（含穿戴设备/娱乐产品等）', '智能家居', '智能安防', '商用/工控设备', '其它'],

  // 邮件模板语言类型
  templateLanguages: [
    { label: '中文(简体)', value: 'zh-cn' },
    { label: '英语(美国)', value: 'en-us' }
  ]
};
