/**
 * 数字类型验证器
 * 说明：验证该值是否数字类型
 * @param  {Any} val 待验证的值
 * @return {Boolean} 验证结果
 */
export function numberic (val) {
  return val ? /^[-+]?[0-9]+$/.test(val) : true
}

/**
 * url验证器
 * 说明：验证该值是否合法的 url 格式
 * @param  {String} val 待验证的值
 * @return {Boolean} 验证结果
 */
export function url (val) {
  return /^(http:\/\/|https:\/\/)(.{4,})$/.test(val)
}
