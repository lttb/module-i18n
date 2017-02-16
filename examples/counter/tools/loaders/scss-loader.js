const postcss = require('postcss-js')
const syntax = require('postcss-scss')

module.exports = (data, file) =>
  postcss.process(file, { syntax })
