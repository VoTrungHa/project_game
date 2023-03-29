import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common';

const ENV_FILE = dotenv.config({ path: '.env.production' });
if (ENV_FILE.error) {
  throw ENV_FILE.error;
}
const ENV = JSON.stringify(ENV_FILE.parsed);

const production: webpack.Configuration = merge(common, {
  mode: 'production',
  entry: ['@babel/polyfill', './src/index.tsx'],
  // devtool: "source-map",
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public', 'index.html'),
      filename: './index.html',
      favicon: './public/favicon.png',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': ENV,
    }),
  ],
});

export default production;
