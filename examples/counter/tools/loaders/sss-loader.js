const postcssJs = require('postcss-js')
const postcss = require('postcss')
const parser = require('sugarss')

module.exports = data =>
  postcss().process(data, { parser }).then(res => postcssJs.objectify(res.root))
