import chai from 'chai'
import prettyBytes from '../../src/filters/pretty-bytes.js'

chai.expect()
const expect = chai.expect

describe('测试 prettyBytes 函数：', () => {
  it('传入空字符串时应该返回"-"', () => {
    expect(prettyBytes('')).to.equal('-')
  })

  it('传入非数字格式时应该返回"-"', () => {
    expect(prettyBytes(NaN)).to.equal('-')
  })

  it('传入的数字小于1024时应该返回一个数字带上单位为"Bytes"的字符串', () => {
    expect(prettyBytes(500)).to.equal('500Bytes')
  })

  it('传入的数字大于1024且小于1048576时应该返回一个数字带上单位为"KB"的字符串', () => {
    expect(prettyBytes(5000)).to.equal('4.88KB')
  })

  it('传入的数字大于1048576且小于1073741824时应该返回一个数字带上单位为"MB"的字符串', () => {
    expect(prettyBytes(5000000)).to.equal('4.77MB')
  })

  it('传入的数字大于1073741824且小于1099511627776时应该返回一个数字带上单位为"GB"的字符串', () => {
    expect(prettyBytes(5000000000)).to.equal('4.66GB')
  })
})
