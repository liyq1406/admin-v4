import chai from 'chai'
import { formatDate } from '../../src/filters.js'

chai.expect()
const expect = chai.expect

describe('Method: formatDate', () => {
  describe('when given an empty string', () => {
    it('should return "-"', () => {
      expect(formatDate('')).to.equal('-')
    })
  })
  describe('when given a JSON-ed Date string', () => {
    it('should return a string like YYYY-MM-DD hh:mm:ss', () => {
      expect(formatDate('2016-09-06T16:08:24Z')).to.equal('2016-09-06 16:08:24')
    })
  })
  describe('when given a Date object', () => {
    it('should return a string like YYYY-MM-DD hh:mm:ss', () => {
      expect(formatDate(new Date())).to.equal('2016-09-06 16:08:24')
    })
  })
})
