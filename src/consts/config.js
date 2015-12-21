
module.exports = {
  apiRoot: 'http://42.121.122.228:8887/v2',
  verifycodeDuration: 90,
  pageCount: 10,
  periods: [
    { label: '7天', value: 7 },
    { label: '30天', value: 30 },
    { label: '90天', value: 90 }
  ],
  regions: [
    { label: '全球', value: 'world'},
    { label: '国内', value: 'china' }
  ],
  datapointTypes: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],
  ruleTypes: ['数据端点', '设备状态'],
  enableStates: ['启用', '禁用'],
  candidateTags: ['严重', '轻微', '通知'],
  errors: {
    '[mac] is not mac address': 'Mac地址不合法',
    '4001003': '验证码有误，请重新输入！',
    '4001004': '验证码有误，请重新输入！',
    '4001005': '该手机号已注册',
    'password error': '密码错误，请重新输入',
    'account vaild error': '帐号不存在',
    '4001019': '该端点索引已存在',
    'mac address exists': '该设备MAC地址已存在',
    'table name exists': '表名已存在',
    '[email] is not a email ':'邮箱格式不合法',
    'verifycode not exists': '验证码不存在',
    '[tag] length vaild error ':'标签的长度不合法',
    'datapoint not exists':'数据点不存在'
  }
};
