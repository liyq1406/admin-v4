import chai from 'chai'
import formatDate from '../../src/filters/format-date.js'

chai.expect()
const expect = chai.expect

let dateStr = '2016-09-06T16:08:24.12345Z'
let date = new Date(dateStr)

describe('Method: formatDate', () => {
  describe('when passing an empty string', () => {
    it('should return "-", when given an empty string', () => {
      expect(formatDate('')).to.equal('-')
    })
  })
  describe('when passing a JSON-format Date string only', () => {
    it('should return a string which format is like yyyy-MM-dd hh:mm:ss', () => {
      expect(formatDate(dateStr)).to.equal('2016-09-06 16:08:24')
    })
  })
  describe('when passing a JSON-format Date string and a string describing the output format', () => {
    it('should return a string which format is like the given format', () => {
      expect(formatDate(dateStr, 'yyyy-MM-dd')).to.equal('2016-09-06')
      expect(formatDate(dateStr, 'hh:mm:ss.SSS')).to.equal('16:08:24.123')
      expect(formatDate(dateStr, 'hh:mm')).to.equal('16:08')
    })
  })
  describe('when passing a Date object', () => {
    it('should return a string which format is like yyyy-MM-dd hh:mm:ss', () => {
      expect(formatDate(date)).to.equal('2016-09-06 16:08:24')
    })
  })
  describe('when passing a JSON-format Date string and a string describing the output format', () => {
    it('should return a string which format is like the given format', () => {
      expect(formatDate(date, 'yyyy-MM-dd')).to.equal('2016-09-06')
      expect(formatDate(date, 'hh:mm:ss.SSS')).to.equal('16:08:24.123')
      expect(formatDate(date, 'hh:mm')).to.equal('16:08')
    })
  })
})