/**
 * 按规定长度截断字符串
 * @param  {String} str 目标字符串
 * @param  {Number} n   规定的长度
 * @return {String}
 */
var truncate = (str, n) => {
  if (typeof n === 'undefined') n = 10

  n = parseInt(n)

  if (isNaN(n) || str.length <= n) return str

  if (n <= 0) return ''

  return `${str.substring(0, n)}...`
}

export default truncate
