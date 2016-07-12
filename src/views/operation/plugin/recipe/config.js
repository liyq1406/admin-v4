/**
 * 设备列表
 * 说明：用于云菜谱可视化指令的添加与编辑
 * 属性说明：
 *   id: 设备ID,
 *   name: 设备名称,
 *   time: 烹饪时长,
 *   max: 可选最大步骤数,
 *   count: 步骤数,
 *   steps: 步骤数据列表,
 *   template: 步骤数据模板
 *     tips: 步骤备注,
 *     bytes: 16进制位
 *       label: 显示名称
 *       value: 值
 *       min: 该位可选最小值
 *       max: 该位可选最大值
 *       unit: 单位
 *       refs: 与该位取值相关的其他位
 *         index: 相关位的索引值
 *         condition: 条件
 *         value: 符合条件时相关位的取值
 *         min: 符合条件是相关位的可选最小值
 *         max: 符合条件是相关位的可选最大值
 *         unit: 单位
 *         origin: 用于暂存原先的值
 *
 * @type {Array}
 */

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
      value: 0,
      min: 0,
      max: 75,
      unit: '℃'
    }, {
      label: '烹饪时间(小时)',
      name: 'hour',
      value: 0,
      min: 0,
      max: 24,
      unit: '小时',
      refs: [{
        index: 7,
        condition: 24,
        value: 0,
        min: 0,
        max: 0,
        unit: '分钟',
        origin: {}
      }]
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
      max: 24,
      unit: '小时',
      refs: [{
        index: 4,
        condition: 24,
        value: 0,
        min: 0,
        max: 0,
        unit: '分钟',
        origin: {}
      }]
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
      max: 24,
      unit: '小时',
      refs: [{
        index: 4,
        condition: 24,
        value: 0,
        min: 0,
        max: 0,
        unit: '分钟',
        origin: {}
      }]
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
      max: 24,
      unit: '小时',
      refs: [{
        index: 6,
        condition: 24,
        value: 0,
        min: 0,
        max: 0,
        unit: '分钟',
        origin: {}
      }]
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
