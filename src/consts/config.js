
module.exports = {
  // apiRoot: 'http://42.121.122.228:8887/v2',
  apiRoot: 'http://120.26.209.230:8887/v2',
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
  datapointTypes: ['布尔类型', '单字节', '16位短整型', '32位整型', '浮点', '字符串'],
  ruleTypes: ['数据端点', '设备状态'],
  enableStates: ['启用', '禁用'],
  candidateTags: ['严重', '轻微', '通知'],
  accountTypes: ['消费电子（含穿戴设备/娱乐产品等）', '智能家居', '智能安防', '商用/工控设备', '其它'],
  fieldTypes: [
    { label: '字符串', value: 'string' },
    { label: '32位整形数字', value: 'int' },
    { label: '布尔类型', value: 'boolean' },
    { label: '浮点类型', value: 'float' },
    { label: '日期类型', value: 'date' }
  ],
  permissionTypes: [
    { label: '添加', value: 'create' },
    { label: '获取', value: 'get' },
    { label: '查找', value: 'find' },
    { label: '修改', value: 'update' },
    { label: '删除', value: 'delete' }
  ],
  errors: {
    '[mac] is not mac address': 'Mac地址不合法',
    'datapoint index exists': '该数据端点索引已存在',
    '4001003': '验证码有误，请重新输入！',
    '4001004': '验证码有误，请重新输入！',
    '4001005': '该手机号已注册',
    'password error': '帐号或密码错误，请重试',
    'account vaild error': '帐号或密码错误，请重试',
    '4001019': '该端点索引已存在',
    'mac address exists': '该设备MAC地址已存在',
    'table name exists': '表名已存在',
    '[email] is not a email ': '邮箱格式不合法',
    'verifycode not exists': '验证码不存在',
    '[tag] length vaild error ': '标签的长度不合法',
    'datapoint not exists': '数据点不存在',
    'firmware version exists': '固件版本已存在'
  }
};
