import api from 'api'

export var trend = []

// 2016-07-23
const dateRe = /(\d{4})(-)(\d{1,2})(-)(\d{1,2})/g

// var originData = {}

export function getTrend (context/* vue 的this对象，用于handleError*/, productId, duration) {
  var range = createDurationTime(duration)
  api.statistics.getProductTrend(productId, range[0], range[1]).then((res) => {
    if (res.status === 200 && res.data.length > 0) {
      beautify(res.data, duration)
    }
  }).catch((res) => {
    context.handleError(res)
  })
}

function beautify (data, duration) {
  console.log(data.length)
  for (var i = 0; i < data.length; i++) {
    var res = dateRe.exec(data[i].day)
    data[i].day = new Date(res[1], res[2], res[3])
  }
  console.log(data)
}

// function compare(a, b) {
//   if (a is less than b by some ordering criterion) {
//     return -1;
//   }
//   if (a is greater than b by the ordering criterion) {
//     return 1;
//   }
//   // a must be equal to b
//   return 0;
// }

function createDurationTime (duration) {
  var curTime = new Date()
  var startTime = curTime
  // var curStr = cur.getFullYear().toString() + '-' + (cur.getMonth() + 1).toString() + '-' + cur.getDate().toString()
  switch (duration) {
    case 7:
      startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 7)
      break
    case 30:
      startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 30)
      break
    case 90:
      startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 90)
      break
    default:
      startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 7)
      break
  }

  var startDay = startTime.getFullYear().toString() + '-' + (startTime.getMonth() + 1).toString() + '-' + startTime.getDate().toString()
  var endDay = curTime.getFullYear().toString() + '-' + (curTime.getMonth() + 1).toString() + '-' + curTime.getDate().toString()

  return [startDay, endDay]
}
