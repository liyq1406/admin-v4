/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function formatDate (date) {
  if (date !== undefined && date.length > 0) {
    return date.replace('T', ' ').replace('Z', '');
  } else {
    return date;
  }
};

/**
 * 下拉框之间去重名
 * @param  {[type]} value 当前过滤的数组
 * @param  {[type]} arr   用于处理的数组
 * @return {[type]}       [description]
 */
export function filterRepeatName (value, arr) {
  console.log(value);
  console.log(arr);
  var result = value;
  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].main === result[i]) {
        result.splice(i, 1);
      }
    }
  }
  console.log(result);
  return result;
};
