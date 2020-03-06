const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './dev/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    compress: true,
    port: 3001,
    historyApiFallback: true,
    contentBase: path.join(__dirname, './build'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve('build'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve('public/index.html'),
    }),
  ],
};