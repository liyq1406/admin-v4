/**
 * 验证该值是否符合某种格式
 * @param  {Any} val 待验证的值
 * @param  {String} type 格式类型
 * @return {Boolean} 验证结果
 */
const strategies = {
  'numberic': /^[-+]?[0-9]+$/,
  'integer': /^[1-9]\d*$/,
  'word': /^\w+$/,
  'mac': /^[0-9a-fA-F]+$/i,
  'sn': /^[0-9a-zA-Z][0-9a-zA-Z\-]*$/i,
  'email': /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  'phone': /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
  'url': /^(http:\/\/|https:\/\/)(.{4,})$/,
  'account': /^[A-Z][a-z0-9_]*$/i,
  'english': /^[A-Z]+$/i,
  'password': /^(?![^a-zA-Z]+$)(?!\D+$).{8,16}$/
}

export function format (val, type) {
  if (val === '') return true

  let result = false
  // TODO 拦截 type 为非数组的情况
  if (typeof type === 'string') {
    // TODO 将 trim 的验证转化为正则表达式
    if (type === 'trim') {
      return val.trim().length === val.length
    }
    type = [type]
  }

  type.forEach((item) => {
    if (strategies.hasOwnProperty(item) && strategies[item].test(val)) {
      result = true
      return
    }
  })

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
 * 在数组内
 * @param  {Any} val 待验证的值
 * @param  {Any} ref 参照值
 * @return {Boolean} 验证结果
 */
export function inArr (val, arr) {
  return arr.indexOf(val) >= 0
}

/**
 * 不在数组内
 * @param  {Any} val 待验证的值
 * @param  {Any} ref 参照值
 * @return {Boolean} 验证结果
 */
export function notInArr (val, arr) {
  return !(arr.indexOf(val) >= 0)
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
