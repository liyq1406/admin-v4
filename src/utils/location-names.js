import Vue from 'vue'
/**
 * [parse description]
 * @param  {string} country 国家
 * @param  {string} state  省份/州
 * @param  {string} city   城市
 * @param  {string} region  区
 * @param  {string} lang    当前语言
 * @return {promise}
 */
var country = {}

function parse (country, state, city, region, lang) {
  if (!lang) {
    lang = 'zh-cn' // 默认中国
  }
  getLocByCountryCode
}
/**
 * 获取指定国家的地理位置信息
 * @return {[type]} [description]
 */
function getLocByCountryCode (countryCode, lang) {
  return new Promise((resolve, reject) => {
    if (_country[countryCode]) {
      resolve(_country[countryCode])
    } else {
      Vue.$http.get(`/static/data/areas/${lang}/${countryCode}.json`).then((res) => {
        _country[countryCode] = res
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
    }
  })
}
