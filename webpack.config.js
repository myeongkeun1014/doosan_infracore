const glob = require('glob');
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

const generateHTMLPlugins = () => glob.sync('./src/**/*.html').map(
  dir => new HtmlWebpackPlugin({
    filename: path.basename(dir),
    template: dir,
  }),
);

const commonWebpackConfig = () => ({
  mode,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'bundle.js',
  },
  entry: ['./src/js/index.js', './src/scss/index.scss'],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/static/',
        to: './static',
      }
    ]),
    ...generateHTMLPlugins(),
  ],
})


const developmentConfig = () => ({
  devServer: {
    contentBase: 'src',
    watchContentBase: true,
    compress: true,
    hot: true,
    open: true,
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      }
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

const productionConfig = () => ({
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
  ],
});

module.exports = merge(commonWebpackConfig(), mode === 'production' ? productionConfig() : developmentConfig());