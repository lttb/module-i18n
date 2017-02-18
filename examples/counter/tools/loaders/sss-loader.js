const postcss = require('postcss-js')
const syntax = require('sugarss')

module.exports = (data, file) =>
  postcss.process(file, { syntax })
