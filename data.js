// https://github.com/Marak/faker.js
var faker = require('faker');
var format = require('date-format');

var fakeData = {
  users: [],
  products: [],
  devices: [],
  guides: [],
  notifications: []
};

for (var i = 1; i <= 5; i++) {
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

module.exports = fakeData;