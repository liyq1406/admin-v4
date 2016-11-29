import Vue from 'vue'
import _ from 'lodash'
/**
 * 通过地区code获取名称
 * @param  {string} country 国家
 * @param  {string} state  省份/州
 * @param  {string} city   城市
 * @param  {string} region  区
 * @param  {string} lang    当前语言
 * @return {promise}
 */
var _country = {}

function parse (country, state, city, region, lang) {
  if (!lang) {
    lang = 'zh-cn' // 默认中国
  }
  return new Promise((resolve, reject) => {
    if (country) {
      let parsedNames = {}
      getLocByCountryCode(country, lang).then((res) => {
        parsedNames.country = res.data.name || ''
        let states = res.data.states
        if (states && states.length) { // 匹配省
          let findState = _.find(states, (item) => {
            return item.code === state
          })
          if (findState) {
            parsedNames.state = findState.name
          } else {
            parsedNames.state = ''
            if (states.length === 1) {
              findState = states[0]
            }
          }
          let citys = findState.citys
          if (city && citys && citys.length) {
            let findCity = _.find(citys, (item) => {
              return item.code === city
            })
            if (findCity) {
              parsedNames.city = findCity.name
              let regions = findCity.regions
              if (region && regions && regions.length) {
                let findRegion = _.find(regions, (item) => {
                  return item.code === city
                })
                if (findRegion) {
                  parsedNames.region = findRegion.name || ''
                } else {
                  parsedNames.region = ''
                }
              }
            } else {
              parsedNames.city = ''
              if (region) {
                parsedNames.region = ''
              }
            }
          }
        } else {
          parsedNames.state = ''
        }
        resolve(parsedNames)
      }).catch((res) => {
        reject()
      })
    } else {
      // reject()
      resolve('')
    }
  })
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
      Vue.http.get(`/static/data/areas/${lang}/${countryCode}.json`).then((res) => {
        _country[countryCode] = res
        resolve(res)
      }).catch((res) => {
        reject(res)
      })
    }
  })
}

export default {
  getLocByCountryCode,
  parse
}
