// https://github.com/Marak/faker.js
var faker = require('faker');
var format = require('date-format');
var i, active, past;
var today = new Date();

var fakeData = {
  users: [],
  products: [],
  devices: [],
  guides: [],
  notifications: [],
  productTrends: []
};

for (i = 1; i <= 5; i++) {
  var date = faker.date.past();
  // 格式化时间
  date = format('yyyy-MM-dd hh:mm:ss', date);
  fakeData.guides.push({
    id: i,
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    date: date
  });

  fakeData.notifications.push({
    id: i,
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    date: date
  });
}

// 产品
fakeData.products = [{
  id: 1,
  name: 'Demo',
  description: '产品的一句话描述',
  pid: '2cd3fa6de8ec434cb7a50a0b5f5ade46'
}, {
  id: 2,
  name: '加湿器',
  description: '水润时刻为您准备！',
  pid: '34cb73f5adea6de8ec4b5f46a50a02cd'
}];

// 设备
for (i = 1; i <= 20; i++) {
  active = Math.random() < 0.5;
  fakeData.devices.push({
    id: i,
    mac: faker.random.uuid(8),
    active: active,
    activate_at: format('yyyy-MM-dd hh:mm:ss', faker.date.past()),
    last_login: format('yyyy-MM-dd hh:mm:ss', faker.date.recent()),
    online: active && Math.random() < 0.5,
    deviceid: faker.random.uuid(16),
    productId: Math.random() < 0.5 ? 1 : 2
  });
}

for (i = 30; i >= 0; i--) {
  past = today.getTime() - i * 24 * 3600 * 1000;
  fakeData.productTrends.push({
    'day': format('yyyy-MM-dd', new Date(past)),
    'activated': 1000 + Math.floor(Math.random() * 500),
    'active': 1000 + Math.floor(Math.random() * 500),
    'send_times':20991,
    'send_bytes':350189,
    'recv_times':15990,
    'recv_bytes':248796
  });
}

module.exports = fakeData;
