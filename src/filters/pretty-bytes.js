/**
 * 比特数转换
 * 如：1024 ---> 1kb
 * @author shengzhi
 * @param {Integer} n byte值
 * @return {String}
 */
var prettyBytes = (n) => {
  let result

  if (n === '' || isNaN(n)) {
    result = '-'
  } else {
    let index = 0
    let units = ['Bytes', 'KB', 'MB', 'GB']
    while (n >= 1024) {
      index++
      n = n / 1024
    }
    result = `${Math.round(n * 100) / 100}${units[index]}`
  }

  return result
}

export default prettyBytes
