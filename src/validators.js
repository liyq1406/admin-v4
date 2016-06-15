/**
 * 验证该值是否符合某种格式
 * @param  {Any} val 待验证的值
 * @param  {String} type 格式类型
 * @return {Boolean} 验证结果
 */
export function format (val, type) {
  var result
  switch (type) {
    // 数字格式
    case 'numberic':
      result = val ? /^[-+]?[0-9]+$/.test(val) : true
      break

    // 邮箱格式
    case 'email':
      result = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)
      break

    // 邮箱格式
    case 'phone':
      result = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
      break

    // URL
    case 'url':
      result = /^(http:\/\/|https:\/\/)(.{4,})$/.test(val)
      break

    default:
      result = false
  }
  return result
}

/**
 * 验证该值是否与指定值相等
 * @param  {Any} val 待验证的值
 * @param  {Any} ref 参照值
 * @return {Boolean} 验证结果
 */
export function equal (val, ref) {
  return val === ref
}
