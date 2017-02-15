/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
  app: path.resolve(__dirname, '../src/client'),
  server: path.resolve(__dirname, '../src/server'),
  dist: path.resolve(__dirname, '../dist'),
}

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
  }),
  new ExtractTextPlugin({
    filename: '[name].css',
    disable: false,
    allChunks: true,
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.NamedModulesPlugin(),
]

module.exports = ['en', 'ru'].map(lang => ({
  entry: {
    [lang]: path.resolve(PATHS.app, 'index.jsx'),
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
  },
  module: {
    rules: [
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
        test: /\.(s[ac]ss|css)$/,
        loader: ExtractTextPlugin.extract({
          loader: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]-[local]___[hash:base64:5]',
              },
            },
            'sass-loader',
          ],
        }),
      },
    ],
  },
  plugins,
  devtool: 'cheap-module-eval-source-map',

  performance: {
    hints: false,
  },
}))
