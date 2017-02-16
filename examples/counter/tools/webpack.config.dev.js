const R = require('ramda')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')


const PORT = 3000

const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  build: path.resolve(__dirname, '../build'),
}

const [lang = 'en'] = (process.env.npm_config_argv.match(/-lang:(\w+)/) || []).reverse()

const { conf, lens, tests } = common({ PATHS, lang })

const plugins = R.over(R.lensProp('plugins'), R.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new HtmlWebpackPlugin({
    inject: true,
    minify: {
      preserveLineBreaks: true,
      collapseWhitespace: true,
    },
    template: 'src/client/templates/client.pug',
    filename: 'index.html',

    lang,
  }),
  new webpack.NamedModulesPlugin(),
]))

const rules = R.compose(
  R.set(
    R.compose(
      R.lensPath(['module', 'rules']),
      lens.byCond(R.whereEq({ test: tests.style }))
    ),
    R.compose(
      R.set(
        R.compose(R.lensProp('use'), lens.byCond(R.whereEq({ loader: 'postcss-loader' }))),
        R.assocPath(['options', 'sourceMap'], true)
      ),
      R.over(
        R.lensProp('use'),
        R.prepend('style-loader')
      )
    )
  ),

  R.over(R.lensPath(['module', 'rules']), R.concat([{
    test: /\.pug$/,
    loader: 'pug-loader',
  }]))
)

const rest = R.merge({
  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',

    path.join(PATHS.app, 'index.jsx'),
  ],
  output: {
    path: PATHS.build,
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  devServer: {
    contentBase: PATHS.app,
    port: PORT,
    historyApiFallback: true,
    hot: true,
  },

  performance: {
    hints: false,
  },
})


module.exports = R.compose(plugins, rules, rest)(conf)
