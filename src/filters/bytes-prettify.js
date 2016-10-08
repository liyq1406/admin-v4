/**
 * 比特数转换
 * 如：1024 ---> 1kb
 * @author shengzhi
 * @param {Integer} n byte值
 * @return {String}
 */
var bytesPrettify = (n) => {
  let result

  if (n === null || n === '' || isNaN(n)) {
    result = '-'
  } else {
    let index = 0
    let units = ['bytes', 'kb', 'mb', 'gb']
    while (n >= 1024) {
      index++
      n = n / 1024
    }
    result = `${Math.round(n * 100) / 100}${units[index]}`
  }

  return result
}

export default bytesPrettify
