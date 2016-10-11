import chai from 'chai'
import truncate from '../../src/filters/truncate.js'

chai.expect()
const expect = chai.expect

describe('测试 truncate 函数：', () => {
  let longStr
  let shortStr

  beforeEach(() => {
    longStr = '一二三四五六七八九十一二三四五六'
    shortStr = '一二三四五六七八'
  })

  it('传入空字符串时应该返回空字符串', () => {
    expect(truncate('')).to.equal('')
  })

  describe('不指定长度时：', () => {
    it('若字符串长度小于10则直接返回该字符串', () => {
      expect(truncate(shortStr)).to.equal(shortStr)
    })

    it('若字符串长度大于10则返回从起始位置开始长度为10的子串', () => {
      expect(truncate(longStr)).to.equal('一二三四五六七八九十...')
    })
  })

  describe('指定长度时：', () => {
    it('若长度不是数字则直接返回该字符串', () => {
      expect(truncate(shortStr, NaN)).to.equal(shortStr)
      expect(truncate(longStr, NaN)).to.equal(longStr)
    })

    it('若长度为0或负数则返回空字符串', () => {
      expect(truncate(shortStr, 0)).to.equal('')
      expect(truncate(longStr, 0)).to.equal('')
    })

    it('若字符串长度小于指定长度则直接返回该字符串', () => {
      expect(truncate(shortStr, 9)).to.equal(shortStr)
      expect(truncate(longStr, 20)).to.equal(longStr)
    })

    it('若字符串长度大于指定长度则返回从起始位置开始指定长度的子串', () => {
      expect(truncate(longStr, 8)).to.equal('一二三四五六七八...')
    })

    it('若长度为浮点数则返回整数部分长度的子串', () => {
      expect(truncate(shortStr, 2.3)).to.equal('一二...')
      expect(truncate(shortStr, 11.3)).to.equal('一二三四五六七八')
      expect(truncate(longStr, 11.3)).to.equal('一二三四五六七八九十一...')
    })
  })
})
