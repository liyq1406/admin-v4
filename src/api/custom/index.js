import field from './field'
import dataSource from './data-source'
import productOverview from './product-overview'

var output = {
  field,
  dataSource,
  productOverview,
  empty
}

/**
 * 清楚缓存
 */
function empty () {
  for (let i in output) {
    if (typeof output[i].empty === 'function') {
      output[i].empty()
    }
  }
}

export default output
