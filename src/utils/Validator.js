var strategies = {
  // 验证是否必填
  required (val, errMsg) {
    if ((val + '').trim() === '') {
      return errMsg
    }
  },

  // 验证是否小于指定最小值
  min (val, min, errMsg) {
    if (val < min - 0) {
      return errMsg
    }
  },

  // 验证是否大于指定最大值
  max (val, max, errMsg) {
    if (val > max - 0) {
      return errMsg
    }
  },

  // 比较两值，验证前值是否小于后值
  compare (val, min, errMsg) {
    if (val - 0 <= min - 0) {
      return errMsg
    }
  }
}

class Validator {
  constructor () {
    this.cache = [] // 用于存放用户添加的验证规则
  }

  /**
   * 添加验证规则
   * @param {String} val 需要验证的值
   * @param {Array} rules 规则
   * @param {Function} cb 回调
   * @example
   *
   * let validator = new Validator()
   * validator.add(datapoint.min, [{
       format: 'required',
       msg: '请填写最小值'
     }, {
       format: 'min:200',
       msg: '最小值不合法'
     }], () => {
       // 验证不通过的处理
     })
   */
  add (val, rules, cb) {
    var self = this
    for (let i = 0, len = rules.length; i < len; i++) {
      (function (rule) {
        let formatArr = rule.format.split(':')
        let errMsg = rule.msg

        self.cache.push({
          run: () => {
            let formatName = formatArr.shift()
            formatArr.unshift(val)
            formatArr.push(errMsg)
            return strategies[formatName].apply(val, formatArr)
          },
          cb: cb
        })
      })(rules[i])
    }
  }

  /**
   * 验证
   */
  validate () {
    for (let i = 0, len = this.cache.length; i < len; i++) {
      let errMsg = this.cache[i].run()
      if (errMsg) {
        this.cache[i].cb()
        return errMsg
      }
    }
  }
}

export default Validator
