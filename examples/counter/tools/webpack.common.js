const R = require('ramda')
const webpack = require('webpack')


const tests = {
  js: /\.jsx?$/,
  style: /\.(s[ac]?ss|css)$/,
}

const rules = ({ PATHS, lang }) => [
  {
    enforce: 'pre',
    test: tests.style,
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]-[local]___[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          parser: 'sugarss',
          plugins: () => [
            require('stylelint')(),
            require('postcss-reporter')({
              clearAllMessages: true,
            }),
            require('precss')(),
          ],
        },
      },
    ],
  },
  {
    enforce: 'pre',
    test: tests.js,
    include: [
      PATHS.app,
    ],
    loaders: [
      {
        loader: 'eslint-loader',
        options: { cache: true },
      },
    ],
  },
  {
    test: tests.js,
    include: [
      PATHS.app,
    ],
    use: [
      {
        loader: 'babel-loader',
        options: { cacheDirectory: true },
      },
      {
        loader: 'module-i18n/lib/loader/webpack',
        options: { lang, supported: ['ru', 'en'] },
      },
    ],
  },
]

const plugins = () => [
  new webpack.NoEmitOnErrorsPlugin(),
]

const lens = {
  byCond: cond => R.lens(
    R.filter(cond),
    R.useWith(R.map, [R.compose(R.when(cond), R.identity)])
  ),
}


module.exports = options => ({
  tests,
  lens,

  conf: {
    resolve: {
      extensions: ['.js', '.jsx', '.sss', '.json'],
    },

    devtool: 'eval',

    plugins: plugins(options),

    module: { rules: rules(options) },
  },
})
