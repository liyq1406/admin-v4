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
    list: '设备列表',
    mac: 'MAC',
    device_id: '设备ID',
    device_name: '设备名称',
    is_active: {
      label: '是否激活',
      tooltip: '设备已联网激活'
    },
    active_date: '激活时间',
    is_online: '在线状态',
    query_device_id_error: '设备ID不可超过2100000000'
  },
  detail: { // 设备详情页翻译
    title: '设备详情',
    not_actived: '未激活',
    actived: '已激活',
    mac: 'MAC',
    online_long: '累计在线时长',
    active_status: '激活状态',
    mode: '型号',
    version: '固件版本',
    device_id: '设备ID',
    sn: 'sn',
    secondary: {
      device: '设备状态',
      history: '历史数据',
      alert: '告警信息',
      remote: '远程诊断',
      users: '用户信息',
      warranty: '维保记录',
      dealers: '经销商'
    }
  },
  info: { // 设备状态信息
    title: '设备状态数据',
    dp_types: {
      type_bool: '布尔类型',
      type_uint8: '单字节(无符号)',
      type_int16: '16位短整型（有符号）',
      type_int32: '32位整型（有符号）',
      type_float: '浮点',
      type_str: '字符串',
      type_char_arr: '字节数组',
      type_uint16: '16位短整型（无符号）',
      type_uint32: '32位整型（无符号）'
    }
  }
}
