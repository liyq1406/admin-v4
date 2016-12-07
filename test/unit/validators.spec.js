import chai from 'chai'
import { format } from '../../src/validators.js'

chai.expect()
const expect = chai.expect

describe('测试表单验证器：', () => {
  // 表单项数据为空字符串
  it('表单项数据为空字符串应该直接返回 true', () => {
    expect(format('', 'numberic')).to.equal(true)
  })

  // 验证数字格式
  it('应该正确验证数字格式', () => {
    expect(format('0', 'numberic')).to.equal(true)
    expect(format('123', 'numberic')).to.equal(true)
  })

  // 验证正整数
  it('应该正确验证正整数', () => {
    expect(format('abc', 'integer')).to.equal(false)
    expect(format('-123', 'integer')).to.equal(false)
    expect(format('0', 'integer')).to.equal(false)
    expect(format('123', 'integer')).to.equal(true)
  })

  // 验证字母+数字组合
  it('应该正确验证字母+数字组合', () => {
    expect(format('-1', 'word')).to.equal(false)
    expect(format('@', 'word')).to.equal(false)
    expect(format('abc', 'word')).to.equal(true)
    expect(format('123', 'word')).to.equal(true)
    expect(format('abc123', 'word')).to.equal(true)
  })

  // 验证MAC地址
  it('应该正确验证MAC地址', () => {
    expect(format('a', 'mac')).to.equal(true)
    expect(format('a123', 'mac')).to.equal(true)
    expect(format('G', 'mac')).to.equal(false)
  })

  // 验证序列号
  it('应该正确验证序列号', () => {
    expect(format('a-b-c', 'sn')).to.equal(true)
    expect(format('a123', 'sn')).to.equal(true)
    expect(format('-abc', 'sn')).to.equal(false)
  })

  // 验证邮箱格式
  it('应该正确验证邮箱格式', () => {
    expect(format('abc@xlink.cn', 'email')).to.equal(true)
    expect(format('ab-c@xlink.cn', 'email')).to.equal(true)
    expect(format('ab_c@xlink.cn', 'email')).to.equal(true)
    expect(format('abc.abc@xlink.cn', 'email')).to.equal(true)
    expect(format('xlink', 'email')).to.equal(false)
    expect(format('@xlink', 'email')).to.equal(false)
    expect(format('@xlink.cn', 'email')).to.equal(false)
  })

  // 验证手机格式
  it('应该正确验证手机格式', () => {
    expect(format('13800138000', 'phone')).to.equal(true)
    expect(format('13300138000', 'phone')).to.equal(true)
    expect(format('1380013800', 'phone')).to.equal(false)
    expect(format('138-0013800', 'phone')).to.equal(false)
  })

  // 验证URL
  it('应该正确验证URL', () => {
    expect(format('http://xlink.cn', 'url')).to.equal(true)
    expect(format('https://xlink.cn', 'url')).to.equal(true)
    expect(format('ftp://xlink.cn', 'url')).to.equal(false)
  })

  // 验证字符串开始与结尾无空格
  it('应该正确验证字符串开始与结尾无空格', () => {
    expect(format('abc', 'trim')).to.equal(true)
    expect(format(' abc123', 'trim')).to.equal(false)
    expect(format('$&$&$#& ', 'trim')).to.equal(false)
  })

  // 验证纯英文
  it('应该正确验证纯英文', () => {
    expect(format('abc', 'english')).to.equal(true)
    expect(format('abc123', 'english')).to.equal(false)
    expect(format('$&$&$#&', 'english')).to.equal(false)
    expect(format('123', 'english')).to.equal(false)
  })

  // 验证英文字母、数字与下划线的组合
  it('应该正确验证英文字母、数字与下划线的组合', () => {
    expect(format('abc', 'account')).to.equal(true)
    expect(format('abc123', 'account')).to.equal(true)
    expect(format('abc_123', 'account')).to.equal(true)
    expect(format('123abc', 'account')).to.equal(false)
    expect(format('1123', 'account')).to.equal(false)
  })

  // 验证8-16位且同时包含大小写字母和数字的密码
  it('应该正确验证8-16位且同时包含大小写字母和数字的密码', () => {
    expect(format('abc', 'password')).to.equal(false)
    expect(format('Abc123', 'password')).to.equal(false)
    expect(format('Xt789456Xt789456Xt789456', 'password')).to.equal(false)
    expect(format('Xt789456', 'password')).to.equal(true)
    expect(format('Xt7--89456', 'password')).to.equal(true)
  })

  // 验证器数组
  it('应该可以传入验证器数组', () => {
    expect(format('abc@xlink.cn', ['account', 'email'])).to.equal(true)
    expect(format('ab-c@xlink.cn', ['account', 'email'])).to.equal(true)
    expect(format('ab_c@xlink.cn', ['account', 'email'])).to.equal(true)
    expect(format('abc.abc@xlink.cn', ['account', 'email'])).to.equal(true)
    expect(format('3xlink@xlink.cn', ['account', 'email'])).to.equal(true)
    expect(format('xlink', ['account', 'email'])).to.equal(true)
    expect(format('3xlink', ['account', 'email'])).to.equal(false)
    expect(format('@xlink', ['account', 'email'])).to.equal(false)
    expect(format('@xlink.cn', ['account', 'email'])).to.equal(false)
  })
})
