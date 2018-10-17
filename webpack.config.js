const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const srcPath = path.join(__dirname, 'src');

module.exports = (env, argv) => {
  const config = {
    entry: ['@babel/polyfill', './src/index.js'],
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [srcPath],
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          include: [srcPath],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.js$/,
          include: [srcPath],
          enforce: 'pre',
          loader: 'eslint-loader',
        },
      ],
    },
    plugins: [new CleanWebpackPlugin(['dist']), new CopyWebpackPlugin(['src/index.html'])],
  };

  if (argv.mode === 'development') {
    config.devServer = {
      historyApiFallback: true,
      host: '0.0.0.0',
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return config;
};
