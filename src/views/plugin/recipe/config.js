export const DEVICES = [{
  id: 0,
  name: '电饭煲',
  time: '',
  max: 11,
  count: 1,
  steps: [],
  template: {
    tips: '',
    bytes: [{
      label: '烹饪方式',
      value: 1,
      min: 1,
      max: 9,
      refs: [{
        index: 1,
        condition: 9,
        value: 0,
        min: 0,
        max: 6,
        unit: false,
        origin: {}
      }, {
        index: 2,
        condition: 9,
        value: 0,
        min: 0,
        max: 3,
        unit: false,
        origin: {}
      }]
    }, {
      label: '烹饪功率',
      value: 100,
      min: 100,
      max: 100,
      unit: '%'
    }, {
      label: '烹饪通时间',
      value: 0,
      min: 0,
      max: 60,
      unit: '秒'
    }, {
      label: '烹饪断时间',
      value: 0,
      min: 0,
      max: 60,
      unit: '秒'
    }, {
      label: '底部烹饪温度',
      value: 100,
      min: 0,
      max: 130,
      unit: '℃'
    }, {
      label: '顶部烹饪温度',
      value: 50,
      min: 0,
      max: 75,
      unit: '℃'
    }, {
      label: '烹饪时间(小时)',
      name: 'hour',
      value: 0,
      min: 0,
      max: 23,
      unit: '小时'
    }, {
      label: '烹饪时间(分钟)',
      value: 0,
      name: 'minute',
      min: 0,
      max: 59,
      unit: '分钟'
    }, {
      label: '顶部加热通断比',
      value: 0,
      min: 0,
      max: 0
    }]
  }
}, {
  id: 1,
  name: '云炖锅',
  time: '',
  max: 19,
  count: 1,
  steps: [],
  template: {
    bytes: [{
      label: '烹饪方式',
      value: 1,
      min: 1,
      max: 5
    }, {
      label: '烹饪功率',
      value: 100,
      min: 0,
      max: 100,
      unit: '%'
    }, {
      label: '烹饪温度',
      value: 100,
      min: 0,
      max: 100,
      unit: '℃'
    }, {
      label: '烹饪时间(小时)',
      name: 'hour',
      value: 0,
      min: 0,
      max: 23,
      unit: '小时'
    }, {
      label: '烹饪时间(分钟)',
      name: 'minute',
      value: 0,
      min: 0,
      max: 59,
      unit: '分钟'
    }]
  }
}, {
  id: 2,
  name: '隔水炖',
  time: '',
  max: 19,
  count: 1,
  steps: [],
  template: {
    tips: '',
    bytes: [{
      label: '烹饪方式',
      value: 1,
      min: 1,
      max: 5
    }, {
      label: '烹饪功率',
      value: 100,
      min: 0,
      max: 100,
      unit: '%'
    }, {
      label: '烹饪温度',
      value: 100,
      min: 0,
      max: 100,
      unit: '℃'
    }, {
      label: '烹饪时间(小时)',
      name: 'hour',
      value: 0,
      min: 0,
      max: 23,
      unit: '小时'
    }, {
      label: '烹饪时间(分钟)',
      name: 'minute',
      value: 0,
      min: 0,
      max: 59,
      unit: '分钟'
    }]
  }
}, {
  id: 3,
  name: '云水壶',
  time: '',
  max: 14,
  count: 1,
  steps: [],
  template: {
    tips: '',
    bytes: [{
      label: '烹饪方式',
      value: 1,
      min: 1,
      max: 7,
      refs: [{
        index: 1,
        condition: 7,
        value: 0,
        min: 0,
        max: 8,
        unit: false,
        origin: {}
      }, {
        index: 2,
        condition: 7,
        value: 0,
        min: 0,
        max: 3,
        unit: false,
        origin: {}
      }]
    }, {
      label: '烹饪功率',
      value: 100,
      min: 0,
      max: 100,
      unit: '%'
    }, {
      label: '烹饪温度',
      value: 100,
      min: 0,
      max: 100,
      unit: '℃'
    }, {
      label: '烹饪通时间',
      value: 0,
      min: 0,
      max: 60,
      unit: '秒'
    }, {
      label: '烹饪断时间',
      value: 0,
      min: 0,
      max: 60,
      unit: '秒'
    }, {
      label: '烹饪时间(小时)',
      name: 'hour',
      value: 0,
      min: 0,
      max: 23,
      unit: '小时'
    }, {
      label: '烹饪时间(分钟)',
      name: 'minute',
      value: 0,
      min: 0,
      max: 59,
      unit: '分钟'
    }]
  }
}]
