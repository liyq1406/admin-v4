import chai from 'chai'
import bytesPrettify from '../../src/filters/bytes-prettify.js'

chai.expect()
const expect = chai.expect

describe('测试 bytesPrettify 函数：', () => {
  it('传入空字符串时应该返回"-"', () => {
    expect(bytesPrettify('')).to.equal('-')
  })

  it('传入非数字格式时应该返回"-"', () => {
    expect(bytesPrettify(NaN)).to.equal('-')
  })

  it('传入的数字小于1024时应该返回一个数字带上单位为"bytes"的字符串', () => {
    expect(bytesPrettify(500)).to.equal('500bytes')
  })

  it('传入的数字大于1024且小于1048576时应该返回一个数字带上单位为"kb"的字符串', () => {
    expect(bytesPrettify(5000)).to.equal('4.88kb')
  })

  it('传入的数字大于1048576且小于1073741824时应该返回一个数字带上单位为"mb"的字符串', () => {
    expect(bytesPrettify(5000000)).to.equal('4.77mb')
  })

  it('传入的数字大于1073741824且小于1099511627776时应该返回一个数字带上单位为"gb"的字符串', () => {
    expect(bytesPrettify(5000000000)).to.equal('4.66gb')
  })
})
