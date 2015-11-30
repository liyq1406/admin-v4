var config = require('./consts/config');
var Promise = require('promise');
var Vue = require('vue');
var VueResource = require('vue-resource');
Vue.use(VueResource);

module.exports = {
  sms: require('./api/sms')(Vue, Promise, config),
  corp: require('./api/corp')(Vue, Promise, config),
  statistics: require('./api/statistics')(Vue, Promise, config),
  product: require('./api/product')(Vue, Promise, config)
};
