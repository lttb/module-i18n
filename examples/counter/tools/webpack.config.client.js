const R = require('ramda')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./webpack.common')


const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  dist: path.resolve(__dirname, '../dist'),
}


const config = (lang) => {
  const { conf, lens, tests } = common({ PATHS, lang })

  const plugins = R.over(R.lensProp('plugins'), R.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true,
    }),
  ]))

  const rules = R.set(
    R.compose(
      R.lensPath(['module', 'rules']),
      lens.byCond(R.whereEq({ test: tests.style }))
    ),
    R.over(
      R.lensProp('use'),
      R.compose(
        ExtractTextPlugin.extract,
        R.merge({ fallback: 'style-loader' }),
        R.objOf('use')
      )
    )
  )

  const rest = R.merge({
    entry: {
      [lang]: path.join(PATHS.app, 'index.jsx'),
    },
    output: {
      path: PATHS.dist,
      filename: '[name].js',
    },
  })

  return R.compose(rest, plugins, rules)(conf)
}


module.exports = ['en', 'ru'].map(config)
