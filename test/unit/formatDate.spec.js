import chai from 'chai'
import formatDate from '../../src/filters/format-date.js'

chai.expect()
const expect = chai.expect

describe('测试 formatDate 函数:', () => {
  let dateStr
  let date

  beforeEach(() => {
    dateStr = '2016-09-06T16:08:24.12345Z'
    date = new Date(dateStr)
  })

  it('传入空字符串时应该返回"-"', () => {
    expect(formatDate('')).to.equal('-')
  })

  it('只传入经过 JSON 处理过的字符串应该返回默认格式的字符串', () => {
    expect(formatDate(dateStr)).to.equal('2016-09-06 16:08:24')
  })

  it('传入经过 JSON 处理过的字符串和输出格式字符串应该返回指定格式的字符串', () => {
    expect(formatDate(dateStr, 'yyyy-MM-dd')).to.equal('2016-09-06')
    expect(formatDate(dateStr, 'hh:mm:ss.SSS')).to.equal('16:08:24.123')
    expect(formatDate(dateStr, 'hh:mm')).to.equal('16:08')
  })

  it('只传入日期对象应该返回默认格式的字符串', () => {
    expect(formatDate(date)).to.equal('2016-09-06 16:08:24')
  })

  it('传入日期对象和输出格式字符串应该返回指定格式的字符串', () => {
    expect(formatDate(date, 'yyyy-MM-dd')).to.equal('2016-09-06')
    expect(formatDate(date, 'hh:mm:ss.SSS')).to.equal('16:08:24.123')
    expect(formatDate(date, 'hh:mm')).to.equal('16:08')
  })
})
