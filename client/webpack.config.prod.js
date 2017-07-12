const { resolve } = require('path');
const { DefinePlugin, NamedModulesPlugin } = require('webpack');

const { API_SERVER_PORT } = process.env;

module.exports = {
  entry: [
    'regenerator-runtime/runtime',
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  context: resolve(__dirname, 'src'),
  devServer: {
    historyApiFallback: true,
    contentBase: resolve(__dirname, 'dist'),
    publicPath: '/',
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      API_SERVER_PORT,
    }),
    new NamedModulesPlugin()
  ]
};
