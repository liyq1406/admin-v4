/**
 * 处理浮点数,保留n位小数
 * @author 国豪
 * @param  {Number} num 浮点数
 * @param  {Number} digits 保留多少位
 * @return {Number}
 */
var toFixed = (num, digits) => {
  var result

  if (typeof digits === 'undefined') {
    digits = 2
  }

  digits = parseInt(digits)

  if (num === '' || isNaN(num) || isNaN(digits)) {
    result = '-'
  } else {
    result = Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)
  }

  return result
}

export default toFixed
