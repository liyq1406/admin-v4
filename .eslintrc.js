module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: {
    '_': true,
    'io': true,
    'alert': true,
    'AMap': true,
    'google': true,
    'describe': true,
    'before': true,
    'beforeEach': true,
    'after': true,
    'afterEach': true,
    'it': true,
    'expect': true,
    'sinon': true
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
