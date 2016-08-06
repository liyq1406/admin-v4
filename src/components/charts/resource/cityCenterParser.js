import {cityCenter} from './baiduMap-cityCenter'

function parserCoordinates (str) {
  var temp = str.split('|')
  if (temp[0]) {
    temp = temp[0].split(',')
  }

  return {
    longitude: temp[0],
    latitude: temp[1]
  }
}
export default function (city) {
  // 遍历直辖市
  cityCenter.municipalities.forEach((item) => {
    if (city === item.n) {
      var res = parserCoordinates(item.g)
      console.log(res)
      return res
    }
  })
  // 遍历港澳台
  cityCenter.other.forEach((item) => {
    if (city === item.n) {
      return parserCoordinates(item.g)
    }
  })
  // 遍历省
  cityCenter.provinces.forEach((item) => {
    if (city === item.n) {
      return parserCoordinates(item.g)
    }
  })
  // 遍历市
  cityCenter.provinces.forEach((item) => {
    item.cities.forEach((cityInfo) => {
      if (city === cityInfo.n) {
        var res = parserCoordinates(item.g)
        console.log(res)
        return res
      }
    })
  })
}
