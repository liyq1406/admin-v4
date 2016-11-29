/**
 * 运营平台用户管理翻译信息入口
 * @return {Object}
 */

import overview from './overview'
import portrait from './portrait'
import list from './list'
import major from './major'
import details from './details'

export default {
  overview,
  portrait,
  list,
  major,
  details,
  fields: {
    nickname: '昵称',
    email: '邮箱',
    location: '地理位置',
    address: '详细地址',
    phone: '手机号',
    gender: '性别',
    id: '用户ID'
  }
}
