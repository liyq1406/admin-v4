/**
 * 产品设备管理翻译信息
 * @return {Object}
 */

export default {
  edit_form: {
    main_title: 'Edit Device',
    del_device: 'Delete device',
    del_confirm_info: 'Confirm to delete this device?'
  },
  fields: {
    name: 'Name',
    mac: 'MAC',
    sn: 'SN',
    location: 'Location',
    address: 'Address',
    mode: 'Model'
  },
  manager: { // 设备管理列表页
    title: 'Device Management',
    sum: {
      count: 'All Devices', // 设备总数
      tooltip: 'Total device amount of current product' // 企业的设备总量
    },
    activated: {
      count: 'Activated Devices', // 激活数
      tooltip: 'Activated device amount' // 已联网激活的设备数量
    },
    online: {
      count: 'Online Devices', // 在线设备数
      tooltip: 'Current online device amount' // 当前在线的设备数量
    },
    users: {
      count: 'All Users ', // 用户总数
      tooltip: 'Total user amount of current product' // 当前产品的用户数量
    },
    list: 'Device List', // 设备列表
    mac: 'MAC', // MAC
    device_id: 'Device ID', // 设备ID
    device_name: 'Device Name', // 设备名称
    is_active: {
      label: 'Activated', // 是否激活
      tooltip: 'Device Connected and Activated' // 设备已联网激活
    },
    active_date: 'Activated Time', // 激活时间
    is_online: 'Status', // 在线状态
    query_device_id_error: 'Device Id could not exceed 2100000000' // 设备ID不可超过2100000000
  },
  detail: { // 设备详情页翻译
    title: 'Device Detail', // 设备详情
    not_actived: 'Not Activated', // 未激活
    actived: 'Activated', // 已激活
    mac: 'MAC', // MAC
    online_long: 'Accumulated Online Time', // 累计在线时长
    active_status: 'Activation Status', // 激活状态
    mode: 'Model', // 型号
    version: 'Firmware Version', // 固件版本
    device_id: 'Device ID', // 设备ID
    sn: 'Serial Number', // sn
    view: 'View',
    qrcode: 'QR Code',
    secondary: {
      device: 'Device Status', // 设备状态
      history: 'History Data', // 历史数据
      alert: 'Alert Message', // 告警信息
      remote: 'Remote Diagnose', // 远程诊断
      users: 'User Information', // 用户信息
      warranty: 'Maintenance Record', // 维保记录
      dealers: 'Dealers' // 经销商
    }
  },
  info: { // 设备状态信息
    title: 'Device Status Data', // 设备状态数据
    index: 'Index', // 索引
    dp_id: 'Data Point ID', // 端点ID
    dp_type: 'Data Point Type', // 端点类型
    dp_describe: 'Data Point Description', // 端点描述
    dp_value: 'Current Value', // 当前值
    dp_types: {
      type_bool: 'Boolean', // 布尔类型
      type_uint8: 'Single Byte (Unsigned)', // 单字节(无符号)
      type_int16: 'Short Integer (Signed)', // 16位短整型（有符号）
      type_int32: 'Integer (Signed)', // 32位整型（有符号）
      type_float: 'Float', // 浮点
      type_str: 'String', // 字符串
      type_char_arr: 'Char Array', // 字节数组
      type_uint16: 'Short Integer (Unsigned)', // 16位短整型（无符号）
      type_uint32: 'Integer (Unsigned)' // 32位整型（无符号）
    }
  },
  history: { // 历史数据
    photo_rule: 'Snapshot Rule', // 快照规则
    dp: 'Data Point', // 数据端点
    describe: 'Description', // 描述
    data_value: 'Value', // 数据值
    no_photo: 'No Record'
  },
  alert: {
    display: 'Display', // 显示
    sign: 'Mark', // 标记为
    processed: 'Processed', // 已处理
    no_processed: 'Unprocessed', // 未处理
    mac: 'MAC', // MAC
    device_id: 'Device ID', // 设备ID
    alert_content: 'Content', // 告警内容
    time: 'Time', // 时间
    hour: 'hrs', // 小时
    minutes: 'mins', // 分钟
    second: 'seconds', // 秒
    time_length: 'Duration', // 持续市长
    alert_level: 'Level', // 告警等级
    state: 'Status', // 状态
    warning: 'Warning', // 轻微
    danger: 'Critical', // 严重
    all_level: 'All Level',
    info: 'Notification'
  },
  diagnose: {
    datapoint: 'Data Point',
    index: 'Index',
    id: 'Data Point ID',
    describe: 'Description',
    current_value: 'Current Value',
    log: 'Device Log',
    no_datapoint: 'No record'
  },
  users: {
    release_bind: 'Unbind',
    nickname: 'Nickname',
    email: 'Email',
    phone: 'Phone',
    last_login: 'Last Login',
    status: 'Status',
    online: 'Online',
    offline: 'Offline'
  }
}
