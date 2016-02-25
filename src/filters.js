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
 * 根据条件过滤选项
 * @param  {Array}  value 过滤前的所有可选项
 * @param  {Array}  arr   已选择的所有项
 * @param  {Object} curr  当前选择的项
 * @param  {String} prop  需要比对的属性
 * @return {Array}        可选的所有项
 */
export function dropSlected (value, selectedArr, curr, prop) {
  return value.filter((cate) => {
    var flag = true;
    selectedArr.forEach(function (item) {
      if (cate[prop] === item[prop] && curr[prop] !== item[prop]) {
        flag = false;
      }
    });
    return flag;
  });
}
