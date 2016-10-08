import toFixed from './to-fixed'

/**
 * 百分比表示浮点数,保留n位小数： 例 0.0201 => 2.01%
 * @param  {Float} value 浮点数
 * @param  {int} n 保留多少位
 * @return {String}
 */
var toPercentage = (number, digits) => {
  return toFixed(number * 100, digits) + '%'
}

export default toPercentage
