/**
 * 运营平台离线数据翻译信息
 * @return {Object}
 */

export default {
  main_title: '离线数据',
  columns: {
    status: '任务进度',
    type: '导出类型',
    begin_time: '任务开始',
    end_time: '任务结束',
    url: '下载地址'
  },
  status: {
    to_be_exported: '待导出',
    exporting: '导出中',
    exported: '导出完成',
    invalid: '无效导出',
    expired: '过期'
  },
  types: {
    device: '设备列表',
    user: '用户列表',
    alert: '告警信息列表',
    heavy_buyer: '大客户列表',
    dealer: '经销商列表',
    warranty: '维保列表',
    device_session_log: '设备上下线',
    wechat_auth_device: '微信设备列表',
    device_aggregate: '设备聚合列表'
  },
  get_url: '获取地址',
  url: '下载地址',
  export_success: '导出CSV任务创建成功'
}
