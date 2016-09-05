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
      // result = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(val)
      result = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val)
      break

    // 邮箱格式
    case 'phone':
      result = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
      break

    // URL
    case 'url':
      result = val ? /^(http:\/\/|https:\/\/)(.{4,})$/.test(val) : true
      break

    // URL
    case 'space':
      result = val.trim().length > 0
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

/**
 * 验证必填  可以传参数定义是否生效 (目前用于消息推送页面)
 * @param  {[type]} val [description]
 * @param  {boolean} needVerification 是否需要验证
 * @return {[type]}     [description]
 */
export function isrequired (val, needVerification) {
  var result = false
  if (needVerification) {
    result = val.length > 0
  } else {
    result = true
  }
  return result
}
