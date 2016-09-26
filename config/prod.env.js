var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))

console.log('Current enviorment: ' + argv['api-server'])
console.log('Building...')

module.exports = {
  NODE_ENV: '"production"',
  API_SERVER: argv['api-server'] ? '"' + argv['api-server'] + '"' : undefined
}
