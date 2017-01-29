/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const PORT = 3000

const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  build: path.resolve(__dirname, '../build'),
}

const lang = (JSON
  .parse(process.env.npm_config_argv)
  .original
  .find(arg => arg.includes('-lang:')) || 'en').replace('-lang:', '')

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
  }),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    minify: {
      preserveLineBreaks: true,
      collapseWhitespace: true,
    },
    template: 'src/client/index.pug',
    filename: 'index.html',
  }),
  new webpack.NamedModulesPlugin(),
]

const rules = [
  {
    enforce: 'pre',
    test: /(\.js|\.jsx)$/,
    include: [
      PATHS.app,
    ],
    loaders: [
      {
        loader: 'eslint-loader',
        query: { cache: true },
      },
    ],
  },
  {
    test: /(\.js|\.jsx)$/,
    include: [
      PATHS.app,
    ],
    use: [
      {
        loader: 'babel-loader',
        query: { cacheDirectory: true },
      },
      {
        loader: 'module-i18n/lib/loader/webpack',
        query: {
          lang,
          supported: ['ru', 'en'],
        },
      },
    ],
  },
  {
    test: /\.(s[a|c]ss|css)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        query: {
          sourceMap: true,
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]-[local]___[hash:base64:5]',
        },
      },
      'sass-loader',
    ],
  },
  {
    test: /\.pug$/,
    loader: 'pug-loader',
  },
]

module.exports = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',

    path.resolve(PATHS.app, 'index.jsx'),
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
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
  },
  module: { rules },
  plugins,
  devServer: {
    contentBase: PATHS.app,
    port: PORT,
    historyApiFallback: true,
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',

  performance: {
    hints: false,
  },
}
