var strategies = {
  required (val, errMsg) {
    if ((val + '').trim() === '') {
      return errMsg
    }
  },

  min (val, min, errMsg) {
    if (val < min - 0) {
      return errMsg
    }
  },

  max (val, max, errMsg) {
    if (val > max - 0) {
      return errMsg
    }
  },

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

  add (val, rules, ref) {
    var self = this
    for (let i = 0, len = rules.length; i < len; i++) {
      (function (rule) {
        let formatArr = rule.format.split(':')
        let errMsg = rule.msg

        self.cache.push(function () {
          let formatName = formatArr.shift()
          formatArr.unshift(val)
          formatArr.push(errMsg)
          return strategies[formatName].apply(val, formatArr)
        })
      })(rules[i])
    }
  }

  validate () {
    for (let i = 0, len = this.cache.length; i < len; i++) {
      let errMsg = this.cache[i]()
      if (errMsg) {
        return errMsg
      }
    }
  }
}

export default Validator
