/**
 * 处理浮点数,保留n位小数
 * @param  {Float} value 浮点数
 * @param  {int} n 保留多少位
 * @return {String}
 */
var toFixed = (number, digits) => {
  var result

  if (digits === null || digits === undefined) {
    digits = 2
  }

  digits = parseInt(digits)

  if (number === null || number === '' || isNaN(number) || isNaN(digits)) {
    result = '-'
  } else {
    result = Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)
  }

  return result
}

export default toFixed
