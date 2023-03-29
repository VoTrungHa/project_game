import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common';

const ENV_FILE = dotenv.config({ path: '.env.development' });
if (ENV_FILE.error) {
  throw ENV_FILE.error;
}

const ENV = JSON.stringify(ENV_FILE.parsed);
const HOST = '0.0.0.0';
const PORT = 8080;

const development: webpack.Configuration = merge(common, {
  mode: 'development',
  entry: [`webpack-dev-server/client?http://${HOST}/${PORT}`, '@babel/polyfill', './src/index.tsx'],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: true,
    inline: true,
    stats: 'minimal',
    port: PORT,
    hot: true,
    noInfo: false,
    quiet: false,
    publicPath: '/',
    open: false,
    host: HOST,
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public', 'index.html'),
      filename: './index.html',
      favicon: './public/favicon.png',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.DefinePlugin({
      'process.env': ENV,
    }),
  ],
});

export default development;
