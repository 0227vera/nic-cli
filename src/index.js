#!/usr/bin/env node

let fs = require('fs')
let path = require('path')
let program = require('commander')
const packageConfig = require('../package.json')

program.command('init <type>').action(function (type) {
  handleType(type)
})

function handleType (type) {
  let isExsit = fs.existsSync(path.resolve(__dirname, `./${type}/index.js`))
  if (!isExsit) {
    require('./help.js')()
  } else {
    require(`./${type}/index.js`)()
  }
}

program.command('usage').action(function () {
  require('./help.js')()
})

program.version(packageConfig.version).option('--no-sauce', 'Remove sauce').parse(process.argv)
if (!program.args.length) {
  program.help()
}
