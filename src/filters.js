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
