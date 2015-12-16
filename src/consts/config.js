module.exports = {
  apiRoot: 'http://42.121.122.228:8887/v2',
  verifycodeDuration: 90,
  pageCount: 10,
  periods: [
    { label: '7天', value: 7 },
    { label: '30天', value: 30 },
    { label: '90天', value: 90 }
  ],
  regions: [
    { label: '全球', value: 'world'},
    { label: '国内', value: 'china' }
  ]
};
