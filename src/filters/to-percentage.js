import toFixed from './to-fixed'

/**
 * 百分比表示浮点数,保留n位小数： 例 0.0201 => 2.01%
 * @author guohao
 * @param  {Number} num 浮点数
 * @param  {Number} digits 保留多少位
 * @return {Number}
 */
var toPercentage = (num, digits) => {
  return toFixed(num * 100, digits) + '%'
}

export default toPercentage
