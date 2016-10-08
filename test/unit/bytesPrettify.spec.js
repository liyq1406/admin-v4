import chai from 'chai'
import bytesPrettify from '../../src/filters/bytes-prettify.js'

chai.expect()
const expect = chai.expect

describe('Method: bytesPrettify', () => {
  describe('when given an empty string', () => {
    it('should return "-"', () => {
      expect(bytesPrettify('')).to.equal('-')
    })
  })
  describe('when given a NaN param', () => {
    it('should return "-"', () => {
      expect(bytesPrettify(NaN)).to.equal('-')
    })
  })
  describe('when given a number less than 1024', () => {
    it('should use unit "bytes"', () => {
      expect(bytesPrettify(500)).to.equal('500bytes')
    })
  })
  describe('when given a number more than 1024 but less than 1048576', () => {
    it('should use unit "kb"', () => {
      expect(bytesPrettify(5000)).to.equal('4.88kb')
    })
  })
  describe('when given a number more than 1048576 but less than 1073741824', () => {
    it('should use unit "mb"', () => {
      expect(bytesPrettify(5000000)).to.equal('4.77mb')
    })
  })
  describe('when given a number more than 1073741824 but less than 1099511627776', () => {
    it('should use unit "gb"', () => {
      expect(bytesPrettify(5000000000)).to.equal('4.66gb')
    })
  })
})
