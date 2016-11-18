import {cityCenter} from './baiduMap-cityCenter'

function parserCoordinates (str) {
  var temp = str.split('|')
  if (temp[0]) {
    temp = temp[0].split(',')
  }

  return temp
}
export default function (city) {
  // 遍历直辖市
  for (let i = 0; i < cityCenter.municipalities.length; i++) {
    if (city === cityCenter.municipalities[i].n) {
      return parserCoordinates(cityCenter.municipalities[i].g)
    }
  }

  // 遍历港澳台
  for (let i = 0; i < cityCenter.other.length; i++) {
    if (city === cityCenter.other[i].n) {
      return parserCoordinates(cityCenter.other[i].g)
    }
  }

  // 遍历省
  for (let i = 0; i < cityCenter.provinces.length; i++) {
    if (city === cityCenter.provinces[i].n) {
      return parserCoordinates(cityCenter.provinces[i].g)
    }
  }

  // 遍历市
  for (let i = 0; i < cityCenter.provinces.length; i++) {
    for (let j = 0; j < cityCenter.provinces[i].cities.length; j++) {
      if (cityCenter.provinces[i].cities[j].n.indexOf(city) > -1) {
        return parserCoordinates(cityCenter.provinces[i].cities[j].g)
      }
    }
  }
}
