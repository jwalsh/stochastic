var webpack = require('webpack');
var PACKAGE = require('./package.json');
var path = require('path');

var banner = PACKAGE.name + ' - ' + PACKAGE.version;

module.exports = {

  entry: './dist/index.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.BannerPlugin(banner)
  ]
};
