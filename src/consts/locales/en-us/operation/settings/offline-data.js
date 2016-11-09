/**
 * 运营平台离线数据翻译信息
 * @return {Object}
 */

export default {
  main_title: 'Offline Data',
  columns: {
    status: 'Progress',
    type: 'Type',
    begin_time: 'Start Time',
    end_time: 'End Time',
    url: 'Download'
  },
  status: {
    to_be_exported: 'To be exported',
    exporting: 'Exporting',
    exported: 'Exported',
    invalid: 'Invalid',
    expired: 'Expired'
  },
  types: {
    device: 'Device',
    user: 'User',
    alert: 'Alert',
    heavy_buyer: 'VIP',
    dealer: 'Dealer',
    warranty: 'Warranty',
    device_session_log: 'Device Online-offline'
  },
  get_url: 'Get URL',
  url: 'Download URL'
}
