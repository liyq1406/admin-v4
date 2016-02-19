import config from './consts/config';
import Promise from 'promise';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

module.exports = {
  sms: require('./api/sms')(Vue, Promise, config),
  corp: require('./api/corp')(Vue, Promise, config),
  dataStorage: require('./api/dataStorage')(Vue, Promise, config),
  device: require('./api/device')(Vue, Promise, config),
  email: require('./api/email')(Vue, Promise, config),
  firmware: require('./api/firmware')(Vue, Promise, config),
  user: require('./api/user')(Vue, Promise, config),
  statistics: require('./api/statistics')(Vue, Promise, config),
  product: require('./api/product')(Vue, Promise, config),
  empower: require('./api/empower')(Vue, Promise, config),
  dataTable: require('./api/data-table')(Vue, Promise, config),
  alert: require('./api/alert')(Vue, Promise, config),
  app: require('./api/app')(Vue, Promise, config),
  upload: require('./api/upload')(Vue, Promise, config),
  diet: require('./api/diet')(Vue, Promise, config)
};
