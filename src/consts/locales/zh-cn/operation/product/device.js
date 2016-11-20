/**
 * 产品设备管理翻译信息
 * @return {Object}
 */

export default {
  manager: { // 设备管理列表页
    title: '设备管理',
    sum: {
      count: '设备总数', // 设备总数
      tooltip: '当前产品的设备总量' // 企业的设备总量
    },
    activated: {
      count: '激活设备数', // 激活数
      tooltip: '已联网激活的设备数量' // 已联网激活的设备数量
    },
    online: {
      count: '在线设备数', // 在线设备数
      tooltip: '当前在线的设备数量' // 当前在线的设备数量
    },
    users: {
      count: '用户总数', // 用户总数
      tooltip: '当前产品的用户数量' // 当前产品的用户数量
    },
    list: '设备列表', // 设备列表
    mac: 'MAC', // MAC
    device_id: '设备ID', // 设备ID
    device_name: '设备名称', // 设备名称
    is_active: {
      label: '是否激活', // 是否激活
      tooltip: '设备已联网激活' // 设备已联网激活
    },
    active_date: '激活时间', // 激活时间
    is_online: '在线状态', // 在线状态
    query_device_id_error: '设备ID不可超过2100000000' // 设备ID不可超过2100000000
  },
  detail: { // 设备详情页翻译
    title: '设备详情', // 设备详情
    not_actived: '未激活', // 未激活
    actived: '已激活', // 已激活
    mac: 'MAC', // MAC
    online_long: '累计在线时长', // 累计在线时长
    active_status: '激活状态', // 激活状态
    mode: '型号', // 型号
    version: '固件版本', // 固件版本
    device_id: '设备ID', // 设备ID
    sn: 'sn', // sn
    view: '点击查看',
    qrcode: '二维码',
    secondary: {
      device: '设备状态', // 设备状态
      history: '历史数据', // 历史数据
      alert: '告警信息', // 告警信息
      remote: '远程诊断', // 远程诊断
      users: '用户信息', // 用户信息
      warranty: '维保记录', // 维保记录
      dealers: '经销商' // 经销商
    }
  },
  info: { // 设备状态信息
    title: '设备状态数据', // 设备状态数据
    index: '索引', // 索引
    dp_id: '端点ID', // 端点ID
    dp_type: '端点类型', // 端点类型
    dp_describe: '端点描述', // 端点描述
    dp_value: '当前值', // 当前值
    dp_types: {
      type_bool: '布尔类型', // 布尔类型
      type_uint8: '单字节(无符号)', // 单字节(无符号)
      type_int16: '16位短整型（有符号）', // 16位短整型（有符号）
      type_int32: '32位整型（有符号）', // 32位整型（有符号）
      type_float: '浮点', // 浮点
      type_str: '字符串', // 字符串
      type_char_arr: '字节数组', // 字节数组
      type_uint16: '16位短整型（无符号）', // 16位短整型（无符号）
      type_uint32: '32位整型（无符号）' // 32位整型（无符号）
    }
  },
  history: { // 历史数据
    photo_rule: '快照规则', // 快照规则
    dp: '数据端点', // 数据端点
    describe: '描述', // 描述
    data_value: '数据值', // 数据值
    no_photo: '暂无数据快照'
  },
  alert: {
    display: '显示', // 显示
    sign: '标记为', // 标记为
    processed: '已处理', // 已处理
    no_processed: '未处理', // 未处理
    mac: 'MAC', // MAC
    device_id: '设备ID', // 设备ID
    alert_content: '告警内容', // 告警内容
    time: '时间', // 时间
    hour: '小时', // 小时
    minutes: '分钟', // 分钟
    second: '秒', // 秒
    time_length: '持续时长', // 持续市长
    alert_level: '告警类型', // 告警等级
    state: '状态', // 状态
    warning: '轻微', // 轻微
    danger: '严重', // 严重
    all_level: '全部等级',
    info: '通知'
  },
  diagnose: {
    datapoint: '数据端点',
    index: '索引',
    id: '端点ID',
    describe: '描述',
    current_value: '当前值',
    log: '设备日志',
    no_datapoint: '暂无端点信息'
  },
  users: {
    release_bind: '解除绑定',
    nickname: '昵称',
    email: '邮箱',
    phone: '电话',
    last_login: '最后一次登录时间',
    status: '在线状态',
    online: '在线',
    offline: '离线'
  }
}
